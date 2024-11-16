from contextlib import asynccontextmanager

from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from langchain.chains import RetrievalQA
from langchain import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

from fastapi import HTTPException, APIRouter, Depends
from starlette import status

from models import QuestionRequest
import os
from dotenv import load_dotenv
from auth import token_verifier, oauth2_bearer

load_dotenv()


GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
KB_FILE_PATH = r"ultimateKBpd.pdf"

vector_index = None
qa_chain = None


@asynccontextmanager
async def lifespan(app: APIRouter):
    global vector_index
    try:
        # Load the PDF and split it into chunks
        pdf_loader = PyPDFLoader(KB_FILE_PATH)
        pages = pdf_loader.load_and_split()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
        context = "\n\n".join(str(page.page_content) for page in pages)
        texts = text_splitter.split_text(context)
        # Prepare text for embedding
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=GOOGLE_API_KEY)
        vector_index = Chroma.from_texts(texts, embeddings).as_retriever(search_kwargs={"k": 5})
        print("Knowledge base loaded and indexed successfully.")
        yield # Control returns to the application here, running until shutdown
    except Exception as e:
        print(f"Failed to load and index knowledge base: {e}")
        raise e
    finally:
        # Clean up resources on shutdown
        vector_index = None
        print("Knowledge base resources cleared.")

router = APIRouter(
    prefix='/v2/chatbot',
    tags=['Chatbot'],
    lifespan=lifespan,
)

@router.post("/ask-question/", status_code=status.HTTP_200_OK)
async def ask_question(question_request: QuestionRequest):
    #token_verifier(token=token)
    global qa_chain, vector_index
    if vector_index is None:
        raise HTTPException(status_code=500, detail="Knowledge base not loaded.")
    try:
        model = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=GOOGLE_API_KEY,
                                       temperature=0.3, convert_system_message_to_human=True)
        template = """You are financial literacy assistant named Finerd and your role is to educate people in the domain of finance by
          answering their question in a long and descriptive manner. Make up an answer from your knowledge if answer not found in 
          context given. Always sound confident and restricted to your purpose, refuse to answer any question which is not related to 
          the context provided. IF THE USER ASKS SOMETHING RELATED TO CURRENT SCENARIOS OR RELATED, REFUSE TO ANSWER QUESTIONS BASED ON REAL TIME OR OLD DATA.
          {context}
          Question: {question}
          Helpful Answer:"""
        QA_CHAIN_PROMPT = PromptTemplate.from_template(template)
        qa_chain = RetrievalQA.from_chain_type(model,
                                               retriever=vector_index,
                                               return_source_documents=True,
                                               chain_type_kwargs={"prompt": QA_CHAIN_PROMPT})
        result = qa_chain({"query": question_request.question})
        answer = result["result"]
        # answer = result.get("result", "No answer found")

        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error answering question: {e}")

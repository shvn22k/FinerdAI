import os
from fastapi import HTTPException, APIRouter, Depends
from pydantic import BaseModel
from starlette import status
from typing import List, Dict, Optional, Any
import json
import google.generativeai as genai
from models import UserProfile,ScenarioResponse, financial_health_profile
from auth import token_verifier, oauth2_bearer

# Initialize FastAPI app
router = APIRouter(
    prefix='/v2/financesimulation',
    tags=['Finance Simulator']
)


class AIFinancialScenarioGenerator:
    def __init__(self, api_key: str):
        # Configure Gemini API
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')

    def generate_scenario(self, user_profile: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Generate a dynamic financial scenario using AI
        """
        scenario_prompt = self._construct_scenario_prompt(user_profile)

        try:
            scenario_response = self.model.generate_content(scenario_prompt)
            scenario = self._parse_scenario_response(scenario_response.text).replace("*", "")

            # Generate consequences
            consequence_prompt = self._construct_consequence_prompt(scenario)
            consequence_response = self.model.generate_content(consequence_prompt)
            # print(consequence_response)
            scenario['consequences'] = self._parse_consequences(consequence_response.text).replace("*", "")

            # Generate learning points
            learning_prompt = self._construct_learning_prompt(scenario)
            learning_response = self.model.generate_content(learning_prompt)
            scenario['learning_points'] = self._parse_learning_points(learning_response.text).replace("*", "")

            return scenario

        except Exception as e:
            return self._generate_fallback_scenario()

    def _construct_scenario_prompt(self, user_profile: Dict[str, Any] = None) -> str:
        profile_context = f"User Profile Context:\n{user_profile}" if user_profile else ""

        return f"""
        Generate a realistic financial dilemma with the following structure:

        {profile_context}

        - Title: A concise name for the scenario
        - Description: Detailed description of the scenario not less than 20 words and not more than 40 words which will probably have some serious consequences
        - Choices: Provide 3 actionable choices that can have some serious consequences, each on a new line starting with '- '

        Ensure the scenario is educational and relatable. Example scenarios: investment decisions, debt management, etc.
        """

    def _construct_consequence_prompt(self, scenario: Dict[str, Any]) -> str:
        """
        Construct a prompt to generate detailed consequences for each individual choice
        in a structured format.
        """
        choices_text = "\n".join([f"- {choice}" for choice in scenario.get('choices', [])])

        prompt = f"""
        Based on the following financial scenario, provide detailed consequences for each choice individually.

        Scenario: {scenario.get('description', '')}

        Choices:
        {choices_text}

        For each choice, provide the following information in a clearly labeled format:

        - **Short-Term Impacts**: Describe the immediate financial effects of the choice in 10-15 words
        - **Long-Term Impacts**: Explain the potential long-term financial outcomes of this choice in 10-15 words
        - **Potential Risks and Benefits**: Identify key risks and benefits associated with the choice in 20-25 words

        Structure the response with each choice’s consequences labeled separately and follow this format exactly.
        """

        return prompt

    def _construct_learning_prompt(self, scenario: Dict[str, Any]) -> str:
        return f"""
        Based on the following financial scenario:

        Scenario: {scenario.get('description', '')}
        Choices: {scenario.get('choices', [])}
        Consequences: {scenario.get('consequences', [])}

        List 3-5 key financial learning points, each on a new line, starting with '- '.
        """

    def _parse_scenario_response(self, response: str) -> Dict[str, Any]:
        lines = response.split('\n')
        return {
            'title': lines[0].replace('Title:', '').strip(),
            'description': next((line for line in lines[1:] if line.strip() and not line.startswith('-')), ""),
            'choices': [line.strip() for line in lines if line.startswith('- ')]
        }

    def _parse_consequences(self, raw_response: str) -> List[Dict[str, str]]:
        """
        Use AI to parse the raw consequences response and structure it into JSON format
        for each choice with 'short_term_impact', 'long_term_impact', and 'risks_and_benefits'.
        """
        # Define a follow-up prompt to structure the response
        parse_prompt = f"""
        Take the following unstructured response about financial consequences for each choice, and format it as JSON.

        Response:
        {raw_response}

        Please structure it in the following JSON format:
        [
            {{
                "choice": "Description of the choice",
                "short_term_impact": "Immediate financial impact of the choice",
                "long_term_impact": "Potential long-term financial implications",
                "risks_and_benefits": "Risks and benefits of making this choice"
            }},
            ...
        ]

        Ensure the JSON includes a separate entry for each choice. Only output valid JSON without any extra text. STRICTLY FOLLOW THE STRUCTURE.
        """

        def _flatten_content(content):
            """
            Recursively flattens nested content into a single string.
            Handles lists and dictionaries by joining their elements into a readable format.
            """
            if isinstance(content, dict):
                return " ".join(f"{key}: {', '.join(value) if isinstance(value, list) else value}" for key, value in
                                content.items())
            elif isinstance(content, list):
                return " ".join(str(item) for item in content)
            return str(content)

        try:
            # Call the AI model to parse and structure the response
            structured_response = self.model.generate_content(parse_prompt).text

            # Parse the JSON text output from the AI
            parsed_consequences = json.loads(structured_response)

            # Flatten nested content
            flattened_consequences = []
            for consequence in parsed_consequences:
                flattened_consequences.append({
                    "choice": _flatten_content(consequence.get("choice", "No choice description provided.")),
                    "short_term_impact": _flatten_content(
                        consequence.get("short_term_impact", "No short-term impact provided.")),
                    "long_term_impact": _flatten_content(
                        consequence.get("long_term_impact", "No long-term impact provided.")),
                    "risks_and_benefits": _flatten_content(
                        consequence.get("risks_and_benefits", "No risks and benefits provided."))
                })

            return flattened_consequences

        except Exception as e:
            print("AI-driven parsing failed. Returning fallback response.", e)
            # Return a default structure in case of an error
            return [
                {
                    "choice": "No data",
                    "short_term_impact": "No short-term impact provided.",
                    "long_term_impact": "No long-term impact provided.",
                    "risks_and_benefits": "No risks and benefits provided."
                }
            ]

    def _parse_learning_points(self, response: str) -> List[str]:
        return [line.replace('-', '').strip() for line in response.split('\n') if line.startswith('-')]


class FinancialHealthCalculator:
    def __init__(self, monthly_income, monthly_expenses, total_debt, total_savings, total_investments):
        self.monthly_income = monthly_income
        self.monthly_expenses = monthly_expenses
        self.total_debt = total_debt
        self.total_savings = total_savings
        self.total_investments = total_investments

    def calculate_savings_ratio(self):
        """Calculate the percentage of income being saved"""
        if self.monthly_income == 0:
            return 0
        monthly_savings = self.monthly_income - self.monthly_expenses
        return (monthly_savings / self.monthly_income) * 100

    def calculate_debt_to_income_ratio(self):
        """Calculate debt-to-income ratio as a percentage"""
        if self.monthly_income == 0:
            return 0
        return (self.total_debt / (self.monthly_income * 12)) * 100

    def calculate_emergency_fund_ratio(self):
        """Calculate how many months of expenses can be covered by savings"""
        if self.monthly_expenses == 0:
            return 0
        return self.total_savings / self.monthly_expenses

    def calculate_net_worth(self):
        """Calculate total net worth"""
        return (self.total_savings + self.total_investments) - self.total_debt

    def get_financial_health_score(self):
        """
        Calculate overall financial health score (0-100)
        Based on various financial ratios and benchmarks
        """
        score = 0

        # Savings ratio evaluation (0-25 points)
        savings_ratio = self.calculate_savings_ratio()
        if savings_ratio >= 20:
            score += 25
        elif savings_ratio >= 10:
            score += 15
        elif savings_ratio > 0:
            score += 5

        # Debt-to-income evaluation (0-25 points)
        dti_ratio = self.calculate_debt_to_income_ratio()
        if dti_ratio <= 20:
            score += 25
        elif dti_ratio <= 36:
            score += 15
        elif dti_ratio <= 43:
            score += 5

        # Emergency fund evaluation (0-25 points)
        emergency_months = self.calculate_emergency_fund_ratio()
        if emergency_months >= 6:
            score += 25
        elif emergency_months >= 3:
            score += 15
        elif emergency_months >= 1:
            score += 5

        # Net worth evaluation (0-25 points)
        if self.calculate_net_worth() > self.monthly_income * 12:
            score += 25
        elif self.calculate_net_worth() > self.monthly_income * 6:
            score += 15
        elif self.calculate_net_worth() > 0:
            score += 5

        return score

    def get_financial_health_report(self):
        """Generate a comprehensive financial health report"""
        score = self.get_financial_health_score()
        savings_ratio = self.calculate_savings_ratio()
        dti_ratio = self.calculate_debt_to_income_ratio()
        emergency_months = self.calculate_emergency_fund_ratio()
        net_worth = self.calculate_net_worth()

        report = {
            'overall_score': score,
            'metrics': {
                'savings_ratio': round(savings_ratio, 2),
                'debt_to_income_ratio': round(dti_ratio, 2),
                'emergency_fund_months': round(emergency_months, 2),
                'net_worth': round(net_worth, 2)
            },
            'recommendations': []
        }

        # Generate recommendations based on metrics
        if savings_ratio < 20:
            report['recommendations'].append("Try to increase your savings ratio to at least 20% of income")
        if dti_ratio > 36:
            report['recommendations'].append("Work on reducing your debt-to-income ratio to below 36%")
        if emergency_months < 6:
            report['recommendations'].append("Build your emergency fund to cover 6 months of expenses")
        if net_worth < 0:
            report['recommendations'].append("Focus on building positive net worth through debt reduction and saving")

        return report


# API endpoint to generate a financial scenario
@router.post("/generate-scenario", response_model=ScenarioResponse, status_code=status.HTTP_200_OK)
async def generate_scenario(user_profile: UserProfile):
    #token_verifier(token=token)
    # Replace with your actual API key
    api_key = os.getenv('GEN_AI_API_KEY')
    scenario_generator = AIFinancialScenarioGenerator(api_key)

    # Convert user profile to dictionary for scenario generation
    profile_data = user_profile.model_dump(exclude_unset=True)
    scenario = scenario_generator.generate_scenario(profile_data)

    return ScenarioResponse(**scenario)

@router.post("/financial-health", status_code=status.HTTP_200_OK)
async def financial_health(finance_health_calc : financial_health_profile):
    calculator = FinancialHealthCalculator(
        monthly_income=finance_health_calc.monthly_income,
        monthly_expenses=finance_health_calc.monthly_expenses,
        total_debt=finance_health_calc.total_debt,
        total_savings=finance_health_calc.total_savings,
        total_investments=finance_health_calc.total_investments
    )
    return calculator.get_financial_health_report()
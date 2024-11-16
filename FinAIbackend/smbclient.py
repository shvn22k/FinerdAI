from smbprotocol.connection import Connection
from smbprotocol.session import Session
from smbprotocol.tree import TreeConnect
from smbprotocol.open import Open, CreateDisposition, ShareAccess, FileAttributes
import uuid


def export_to_smb(local_file_path, server_name, share_name, username, password, destination_path):
    """
    Export a local file to an SMB share on OMV.

    Parameters:
    - local_file_path: Path to the local file to be uploaded.
    - server_name: IP address or hostname of the OMV server.
    - share_name: Name of the shared folder on OMV.
    - username: SMB username for OMV.
    - password: SMB password for OMV.
    - destination_path: Path within the SMB share to save the file.
    """
    unique_id = str(uuid.uuid4())
    connection = Connection(uuid=unique_id, server=server_name, port=445)
    connection.connect()
    session = Session(connection, username, password)
    session.connect()

    # Access the OMV share
    tree = TreeConnect(session, f"\\\\{server_name}\\{share_name}")
    tree.connect()

    # Open the destination file in the SMB share and write to it
    with open(local_file_path, "rb") as local_file:
        file_open = Open(tree, destination_path, CreateDisposition.FILE_OVERWRITE_IF)
        file_open.write(local_file.read(), offset=0)
        file_open.close()

    # Clean up SMB connections
    tree.disconnect()
    session.disconnect()
    connection.disconnect()


def retrieve_from_smb(server_name, share_name, username, password, remote_file_path, local_file_path):
    """
    Retrieve a file from an SMB share and save it locally.

    Parameters:
    - server_name: IP address or hostname of the SMB server.
    - share_name: Name of the shared folder on the server.
    - username: SMB username.
    - password: SMB password.
    - remote_file_path: Path to the file on the SMB share.
    - local_file_path: Path where the file will be saved locally.
    """
    unique_id = str(uuid.uuid4())
    connection = Connection(uuid=unique_id, server=server_name, port=445)
    connection.connect()
    session = Session(connection, username, password)
    session.connect()

    # Access the SMB share
    tree = TreeConnect(session, f"\\\\{server_name}\\{share_name}")
    tree.connect()

    # Open and read the file from the SMB share
    file_open = Open(tree, remote_file_path, access_mask=FileAttributes.FILE_READ_DATA,
                     share_access=ShareAccess.FILE_SHARE_READ)
    with open(local_file_path, "wb") as local_file:
        local_file.write(file_open.read())
    file_open.close()

    # Clean up SMB connections
    tree.disconnect()
    session.disconnect()
    connection.disconnect()
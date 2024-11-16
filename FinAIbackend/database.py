import os

from dotenv import load_dotenv
from mysql.connector import pooling, Error

load_dotenv(dotenv_path='.env')
# Connection pool for efficient database connection management
connection_pool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=5,  # Adjust based on your load
    pool_reset_session=True,
    host='127.0.0.1',  # Replace with your MySQL host
    database=os.getenv('MYSQL_DATABASE'),  # Replace with your database name
    user=os.getenv('MYSQL_USERNAME'),  # Replace with your MySQL username
    password=os.getenv('MYSQL_PASSWORD') ,
    # Replace with your MySQL password
)


class Database:
    @staticmethod
    def execute_query(query: str, params: tuple):
        """Executes a given SQL query using a connection from the pool."""
        try:
            # Get connection from the pool
            connection = connection_pool.get_connection()
            if connection.is_connected():
                cursor = connection.cursor(buffered=True)
                cursor.execute(query, params)
                connection.commit()
                return cursor.rowcount  # Optionally    return the number of rows affected
        except Error as e:
            raise RuntimeError(f"Database error: {e}")
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()

    @staticmethod
    def get_user_data(username: str, required_fields: tuple):
        try:
            connection = connection_pool.get_connection()
            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(f"SELECT {', '.join(required_fields)} FROM user_data WHERE username = '{username}'")
                value = cursor.fetchone()
                req_data = {}
                for i in range(len(required_fields)):
                    req_data[required_fields[i]] = value[i]
                return req_data.copy()

        except Error as e:
            raise RuntimeError(f"Database error: {e}")
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()

    @staticmethod
    def get_user_pass(username: str):
        try:
            connection = connection_pool.get_connection()
            if connection.is_connected():
                cursor = connection.cursor()
                cursor.execute(f"SELECT hashed_password FROM users WHERE username = '{username}'")
                value = cursor.fetchone()
                return value

        except Error as e:
            raise RuntimeError(f"Database error: {e}")
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()

    @staticmethod
    def check_user(username: str, usr_email: str):
        try:
            connection = connection_pool.get_connection()
            if connection.is_connected():
                cursor = connection.cursor(buffered=True)
                cursor.execute(f"SELECT username, email FROM users WHERE username = '{username}' or email = '{usr_email}'")
                value = cursor.fetchone()
                print(value)
                return value

        except Error as e:
            raise RuntimeError(f"Database error: {e}")
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()


def chk_username(username: str):
    try:
        connection = connection_pool.get_connection()
        if connection.is_connected():
            cursor = connection.cursor(buffered=True)
            cursor.execute(f"SELECT username FROM user_data WHERE username = '{username}'")
            value = cursor.fetchone()
            return value

    except Error as e:
        raise RuntimeError(f"Database error: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
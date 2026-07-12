from portalsdk import APIContext, APIMethodType, APIRequest
import os
from dotenv import load_dotenv

load_dotenv()

def main():
    public_key = os.environ.get('MPESA_PUBLIC_KEY')
    api_key = os.environ.get('MPESA_API_KEY')

    api_context = APIContext()
    api_context.api_key = api_key
    api_context.public_key = public_key
    api_context.ssl = True
    api_context.method_type = APIMethodType.GET
    api_context.address = 'openapi.m-pesa.com'
    api_context.port = 443
    api_context.path = '/sandbox/ipg/v2/vodacomTZN/getSession/'

    api_context.add_header('Origin', '*')

    api_request = APIRequest(api_context)

    result = None
    try:
        result = api_request.execute()
    except Exception as e:
        print('Call Failed: ' + str(e))

    if result is None:
        raise Exception('SessionKey call failed to get result. Please check.')

    print("Status:", result.status_code)
    print("Headers:", result.headers)
    print("Body:", result.body)

if __name__ == '__main__':
    main()

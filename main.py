from fastapi import FastAPI
import requests

platform_templates = {
    "kuda": {
        "email": "dpo@kuda.com",
        "subject": "Data protection request regarding my Kuda account",
        "body": """Dear Data Protection Officer,

I am writing to exercise my rights under applicable data protection laws (including the NDPA/NDPR and, where applicable, the GDPR) in relation to my Kuda account.

Account details:
- Full name: [your full name]
- Registered email address: [your Kuda email]
- Phone number linked to the account: [your phone]
- Country of residence: [your country]

I am requesting that you:
1. Confirm whether you process my personal data and provide access to, and a copy of, that data.
2. Erase any personal data that is no longer necessary for the purposes for which it was collected, and restrict processing where the law requires it.

Please also provide information on the purposes of processing, categories of personal data, categories of recipients, retention periods, and my right to lodge a complaint with the relevant supervisory authority.

If you erase any of my personal data, I require written confirmation of the deletion, including:
- Which categories of personal data have been erased;
- Which data (if any) has been retained and the legal basis for retention;
- Whether third parties who received my data have been notified of the erasure.

You may request any additional information reasonably required to verify my identity. Unless an extension is justified, I expect your response within the statutory time limit.

Kind regards,
[your name]
[contact details]"""
    },

    "github": {
        "email": "dpo@github.com",
        "subject": "Data protection request regarding my GitHub account",
        "body": """Dear Data Protection Officer,

I am writing to exercise my rights under applicable data protection laws (including the GDPR) in relation to my GitHub account.

Account details:
- Full name: [your full name]
- GitHub username: [your GitHub username]
- Registered email address: [your GitHub email]
- Country of residence: [your country]

I am requesting that you:
1. Confirm whether you process my personal data and provide access to, and a copy of, that data.
2. Erase any personal data that is no longer necessary for the purposes for which it was collected, and restrict processing where the law requires it.

Please also provide information on the purposes of processing, categories of personal data, categories of recipients, retention periods, and my right to lodge a complaint with the relevant supervisory authority.

If you erase any of my personal data, I require written confirmation of the deletion, including:
- Which categories of personal data have been erased;
- Which data (if any) has been retained and the legal basis for retention;
- Whether third parties who received my data have been notified of the erasure.

You may request any additional information reasonably required to verify my identity. Unless an extension is justified, I expect your response within the statutory time limit.

Kind regards,
[your name]
[contact details]"""
    },

    "spotify": {
        "email": "privacy@spotify.com",
        "subject": "Data protection request regarding my Spotify account",
        "body": """Dear Data Protection Officer / Privacy Team,

I am writing to exercise my rights under applicable data protection laws (including the GDPR) in relation to my Spotify account.

Account details:
- Full name: [your full name]
- Spotify username / display name: [your Spotify username]
- Email address associated with the account: [your email]
- Country of residence: [your country]
- Subscriber ID or reference (if available): [your subscriber ID]

I am requesting that you:
1. Confirm whether you process my personal data and provide access to, and a copy of, that data.
2. Erase any personal data that is no longer necessary for the purposes for which it was collected, and restrict processing where the law requires it.

Please also provide information on the purposes of processing, categories of personal data, categories of recipients (including any international transfers), retention periods, and my right to lodge a complaint with the relevant supervisory authority.

If you erase any of my personal data, I require written confirmation of the deletion, including:
- Which categories of personal data have been erased;
- Which data (if any) has been retained and the legal basis for retention;
- Whether third parties who received my data have been notified of the erasure.

You may request any additional information reasonably required to verify my identity. Unless an extension is justified, I expect your response within the statutory time limit.

Kind regards,
[your name]
[contact details]"""
    },

    "bet9ja": {
        "email": "dataprotection@bet9ja.com",
        "subject": "Data protection request regarding my Bet9ja account",
        "body": """Dear Data Protection Officer,

I am writing to exercise my rights under applicable data protection laws (including the NDPA/NDPR and, where applicable, the GDPR) in relation to my Bet9ja account.

Account details:
- Full name: [your full name]
- Bet9ja username / customer ID: [your Bet9ja ID]
- Registered email address: [your email]
- Phone number linked to the account: [your phone]
- Country of residence: [your country]

I am requesting that you:
1. Confirm whether you process my personal data and provide access to, and a copy of, that data.
2. Erase any personal data that is no longer necessary for the purposes for which it was collected, and restrict processing where the law requires it.

Please also provide information on the purposes of processing, categories of personal data, categories of recipients, retention periods, and my right to lodge a complaint with the relevant supervisory authority.

If you erase any of my personal data, I require written confirmation of the deletion, including:
- Which categories of personal data have been erased;
- Which data (if any) has been retained and the legal basis for retention;
- Whether third parties who received my data have been notified of the erasure.

You may request any additional information reasonably required to verify my identity. Unless an extension is justified, I expect your response within the statutory time limit.

Kind regards,
[your name]
[contact details]"""
    },

    "sportbet": {
        "email": "compliance@sportybet.com",
        "subject": "Data protection request regarding my SportyBet account",
        "body": """Dear Compliance / Data Protection Officer,

I am writing to exercise my rights under applicable data protection laws (including the NDPA/NDPR and, where applicable, the GDPR) in relation to my SportyBet account.

Account details:
- Full name: [your full name]
- SportyBet username / customer ID: [your SportyBet ID]
- Registered email address: [your email]
- Phone number linked to the account: [your phone]
- Country of residence: [your country]

I am requesting that you:
1. Confirm whether you process my personal data and provide access to, and a copy of, that data.
2. Erase any personal data that is no longer necessary for the purposes for which it was collected, and restrict processing where the law requires it.

Please also provide information on the purposes of processing, categories of personal data, categories of recipients, retention periods, and my right to lodge a complaint with the relevant supervisory authority.

If you erase any of my personal data, I require written confirmation of the deletion, including:
- Which categories of personal data have been erased;
- Which data (if any) has been retained and the legal basis for retention;
- Whether third parties who received my data have been notified of the erasure.

You may request any additional information reasonably required to verify my identity. Unless an extension is justified, I expect your response within the statutory time limit.

Kind regards,
[your name]
[contact details]"""
    },

    "medium": {
        "email": "privacy@medium.com",
        "subject": "Data protection request regarding my Medium account",
        "body": """Dear Privacy Team,

I am writing to exercise my rights under applicable data protection laws (including the GDPR) in relation to my Medium account.

Account details:
- Full name: [your full name]
- Medium username: [your Medium username]
- Registered email address: [your email]
- Country of residence: [your country]

I am requesting that you:
1. Confirm whether you process my personal data and provide access to, and a copy of, that data.
2. Erase any personal data that is no longer necessary for the purposes for which it was collected, and restrict processing where the law requires it.

Please also provide information on the purposes of processing, categories of personal data, categories of recipients, retention periods, and my right to lodge a complaint with the relevant supervisory authority.

If you erase any of my personal data, I require written confirmation of the deletion, including:
- Which categories of personal data have been erased;
- Which data (if any) has been retained and the legal basis for retention;
- Whether third parties who received my data have been notified of the erasure.

You may request any additional information reasonably required to verify my identity. Unless an extension is justified, I expect your response within the statutory time limit.

Kind regards,
[your name]
[contact details]"""
    },

    "reddit": {
        "email": "dpo@reddit.com",
        "subject": "Data protection request regarding my Reddit account",
        "body": """Dear Data Protection Officer,

I am writing to exercise my rights under applicable data protection laws (including the GDPR and any relevant local laws) in relation to my Reddit account.

Account details:
- Full name: [your full name]
- Reddit username: [your Reddit username]
- Email address associated with the account: [your email]
- Country of residence: [your country]

I am requesting that you:
1. Confirm whether you process my personal data and provide access to, and a copy of, that data.
2. Erase any personal data that is no longer necessary for the purposes for which it was collected, and restrict processing where the law requires it.

Please also provide information on the purposes of processing, categories of personal data, categories of recipients (including any international transfers), retention periods, and my right to lodge a complaint with the relevant supervisory authority.

If you erase any of my personal data, I require written confirmation of the deletion, including:
- Which categories of personal data have been erased;
- Which data (if any) has been retained and the legal basis for retention;
- Whether third parties who received my data have been notified of the erasure.

You may request any additional information reasonably required to verify my identity. Unless an extension is justified, I expect your response within the statutory time limit.

Kind regards,
[your name]
[contact details]"""
    },

    "linkedin": {
        "email": "https://www.linkedin.com/help/linkedin/ask/TSO-DPO",
        "subject": "Data protection request regarding my LinkedIn account",
        "body": """[Paste this text into the LinkedIn DPO web form:]

Dear Data Protection Officer,

I am writing to exercise my rights under the GDPR and any other applicable data protection laws in relation to my LinkedIn account.

Account details:
- Full name: [your full name]
- LinkedIn profile URL: [your LinkedIn URL]
- Email address associated with the account: [your email]
- Country of residence: [your country]

I am requesting that you:
1. Confirm whether you process my personal data and provide access to, and a copy of, that data.
2. Erase any personal data that is no longer necessary for the purposes for which it was collected, and restrict processing where the law requires it.

Please also provide information on the purposes of processing, categories of personal data, categories of recipients, retention periods, and my right to lodge a complaint with the relevant supervisory authority.

If you erase any of my personal data, I require written confirmation of the deletion, including:
- Which categories of personal data have been erased;
- Which data (if any) has been retained and the legal basis for retention;
- Whether third parties who received my data have been notified of the erasure.

You may request any additional information reasonably required to verify my identity. Unless an extension is justified, I expect your response within the statutory time limit.

Kind regards,
[your name]
[contact details]"""
    },

    "tiktok": {
        "email": "https://www.tiktok.com/legal/report/dpo",
        "subject": "Data protection request regarding my TikTok account",
        "body": """[Paste this text into the TikTok DPO web form:]

Dear Data Protection Officer,

I am writing to exercise my rights under the GDPR and any other applicable data protection laws in relation to my TikTok account.

Account details:
- Full name: [your full name]
- TikTok username: [your TikTok username]
- Email address associated with the account: [your email]
- Country of residence: [your country]

I am requesting that you:
1. Confirm whether you process my personal data and provide access to, and a copy of, that data.
2. Erase any personal data that is no longer necessary for the purposes for which it was collected, and restrict processing where the law requires it.

Please also provide information on the purposes of processing, categories of personal data, categories of recipients, retention periods, and my right to lodge a complaint with the relevant supervisory authority.

If you erase any of my personal data, I require written confirmation of the deletion, including:
- Which categories of personal data have been erased;
- Which data (if any) has been retained and the legal basis for retention;
- Whether third parties who received my data have been notified of the erasure.

You may request any additional information reasonably required to verify my identity. Unless an extension is justified, I expect your response within the statutory time limit.

Kind regards,
[your name]
[contact details]"""
    },

    "opay": {
        "email": "ng-privacy@opay-inc.com",
        "subject": "Data protection request regarding my OPay account",
        "body": """Dear Data Protection Officer,

I am writing to exercise my rights under applicable data protection laws (including the NDPA/NDPR and, where applicable, the GDPR) in relation to my OPay account.

Account details:
- Full name: [your full name]
- Phone number / email registered with OPay: [your details]
- Country of residence: [your country]

I am requesting that you:
1. Confirm whether you process my personal data and provide access to, and a copy of, that data.
2. Erase any personal data that is no longer necessary for the purposes for which it was collected, and restrict processing where the law requires it.

Please also provide information on the purposes of processing, categories of personal data, categories of recipients, retention periods, and my right to lodge a complaint with the relevant supervisory authority.

If you erase any of my personal data, I require written confirmation of the deletion, including:
- Which categories of personal data have been erased;
- Which data (if any) has been retained and the legal basis for retention;
- Whether third parties who received my data have been notified of the erasure.

You may request any additional information reasonably required to verify my identity. Unless an extension is justified, I expect your response within the statutory time limit.

Kind regards,
[your name]
[contact details]"""
    },

    "jumia": {
        "email": "Nigeria.Legal@Jumia.com",
        "subject": "Data protection request regarding my Jumia / JumiaPay account",
        "body": """Dear Data Privacy Officer,

I am writing to exercise my rights under applicable data protection laws (including the NDPA/NDPR and, where applicable, the GDPR) in relation to my Jumia / JumiaPay account.

Account details:
- Full name: [your full name]
- Jumia email address: [your Jumia email]
- Phone number linked to the account: [your phone]
- Relevant order IDs (if applicable): [order IDs]
- Country of residence: [your country]

I am requesting that you:
1. Confirm whether you process my personal data and provide access to, and a copy of, that data.
2. Erase any personal data that is no longer necessary for the purposes for which it was collected, and restrict processing where the law requires it.

Please also provide information on the purposes of processing, categories of personal data, categories of recipients, retention periods, and my right to lodge a complaint with the relevant supervisory authority.

If you erase any of my personal data, I require written confirmation of the deletion, including:
- Which categories of personal data have been erased;
- Which data (if any) has been retained and the legal basis for retention;
- Whether third parties who received my data have been notified of the erasure.

You may request any additional information reasonably required to verify my identity. Unless an extension is justified, I expect your response within the statutory time limit.

Kind regards,
[your name]
[contact details]"""
    },

    "konga": {
        "email": "dataprotection@kongapay.com",
        "subject": "Data protection request regarding my KongaPay account",
        "body": """Dear Data Protection Officer,

I am writing to exercise my rights under applicable data protection laws (including the NDPA/NDPR and, where applicable, the GDPR) in relation to my KongaPay account.

Account details:
- Full name: [your full name]
- KongaPay username / customer ID: [your KongaPay ID]
- Registered email address: [your email]
- Phone number linked to the account: [your phone]
- Country of residence: [your country]

I am requesting that you:
1. Confirm whether you process my personal data and provide access to, and a copy of, that data.
2. Erase any personal data that is no longer necessary for the purposes for which it was collected, and restrict processing where the law requires it.

Please also provide information on the purposes of processing, categories of personal data, categories of recipients, retention periods, and my right to lodge a complaint with the relevant supervisory authority.

If you erase any of my personal data, I require written confirmation of the deletion, including:
- Which categories of personal data have been erased;
- Which data (if any) has been retained and the legal basis for retention;
- Whether third parties who received my data have been notified of the erasure.

You may request any additional information reasonably required to verify my identity. Unless an extension is justified, I expect your response within the statutory time limit.

Kind regards,
[your name]
[contact details]"""
    },

    "piggyvest": {
        "email": "legal@piggyvest.com",
        "subject": "Data protection request regarding my PiggyVest account",
        "body": """Dear Data Protection Officer,

I am writing to exercise my rights under applicable data protection laws (including the NDPA/NDPR and, where applicable, the GDPR) in relation to my PiggyVest account.

Account details:
- Full name: [your full name]
- PiggyVest username: [your PiggyVest username]
- Email address associated with the account: [your email]
- Phone number linked to the account: [your phone]
- Country of residence: [your country]

I am requesting that you:
1. Confirm whether you process my personal data and provide access to, and a copy of, that data.
2. Erase any personal data that is no longer necessary for the purposes for which it was collected, and restrict processing where the law requires it.

Please also provide information on the purposes of processing, categories of personal data, categories of recipients, retention periods, and my right to lodge a complaint with the relevant supervisory authority.

If you erase any of my personal data, I require written confirmation of the deletion, including:
- Which categories of personal data have been erased;
- Which data (if any) has been retained and the legal basis for retention;
- Whether third parties who received my data have been notified of the erasure.

You may request any additional information reasonably required to verify my identity. Unless an extension is justified, I expect your response within the statutory time limit.

Kind regards,
[your name]
[contact details]"""
    },

    "palmpay": {
        "email": "dpo@palmpay-inc.com",
        "subject": "Data protection request regarding my PalmPay account",
        "body": """Dear Data Protection Officer,

I am writing to exercise my rights under applicable data protection laws (including the NDPA/NDPR and, where applicable, the GDPR) in relation to my PalmPay account.

Account details:
- Full name: [your full name]
- Phone number / email registered with PalmPay: [your details]
- Country of residence: [your country]

I am requesting that you:
1. Confirm whether you process my personal data and provide access to, and a copy of, that data.
2. Erase any personal data that is no longer necessary for the purposes for which it was collected, and restrict processing where the law requires it.

Please also provide information on the purposes of processing, categories of personal data, categories of recipients, retention periods, and my right to lodge a complaint with the relevant supervisory authority.

If you erase any of my personal data, I require written confirmation of the deletion, including:
- Which categories of personal data have been erased;
- Which data (if any) has been retained and the legal basis for retention;
- Whether third parties who received my data have been notified of the erasure.

You may request any additional information reasonably required to verify my identity. Unless an extension is justified, I expect your response within the statutory time limit.

Kind regards,
[your name]
[contact details]"""
    },

    "pinterest": {
        "email": "privacy-support@pinterest.com",
        "subject": "Data protection request regarding my Pinterest account",
        "body": """Dear Privacy Support / Data Protection Officer,

I am writing to exercise my rights under the GDPR and any other applicable data protection laws in relation to my Pinterest account.

Account details:
- Full name: [your full name]
- Pinterest username: [your Pinterest username]
- Email address associated with the account: [your email]
- Country of residence: [your country]

I am requesting that you:
1. Confirm whether you process my personal data and provide access to, and a copy of, that data.
2. Erase any personal data that is no longer necessary for the purposes for which it was collected, and restrict processing where the law requires it.

Please also provide information on the purposes of processing, categories of personal data, categories of recipients (including any international transfers), retention periods, and my right to lodge a complaint with the relevant supervisory authority.

If you erase any of my personal data, I require written confirmation of the deletion, including:
- Which categories of personal data have been erased;
- Which data (if any) has been retained and the legal basis for retention;
- Whether third parties who received my data have been notified of the erasure.

You may request any additional information reasonably required to verify my identity. Unless an extension is justified, I expect your response within the statutory time limit.

Kind regards,
[your name]
[contact details]

[Optional: I am also submitting this request via Pinterest's Data Protection Officer contact form for tracking purposes.]"""
    }
}

app = FastAPI()

@app.get("/check_email/")
def check_email(email: str):
    url = "https://breachdirectory.p.rapidapi.com/"
    querystring = {"func":"auto","term":email}
    headers = {
        "x-rapidapi-key": "2e951d0b97msha59532c8f122745p191ea8jsn4292ea0a892a",
        "x-rapidapi-host": "breachdirectory.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)
    email_result = {"message": f"Your email was found in {response.json()['found']} breaches." , "result": response.json()["result"]}
    return email_result

@app.get("/request_deletion/")
def request_deletion(platform: str):
    email_info = platform_templates.get(platform.lower())
    if email_info:
        print(email_info)
        return email_info
    else:
        return {"error": "Platform not supported."}


@app.get("/privacy_policy_check/")
def privacy_policy_check(policy_text: str):
    pass  # Placeholder for AI-based privacy policy analysis
from typing import Dict, Optional
import requests
import time
import os
from dotenv import load_dotenv

from .company_dataclass import CompanyData


# Load environment variables
load_dotenv()
BRIGHTDATA_API_KEY = os.getenv("BRIGHTDATA_API_KEY")
CRUNCHBASE_API_KEY = os.getenv("CRUNCHBASE_API_KEY")

if not BRIGHTDATA_API_KEY:
    raise ValueError("BRIGHTDATA_API_KEY not found in environment variables")
if not CRUNCHBASE_API_KEY:
    raise ValueError("CRUNCHBASE_API_KEY not found in environment variables")


def get_uuid_from_company_name(company_name: str) -> Optional[str]:
    """
    Get the UUID of a company from Crunchbase API.

    Args:
        company_name: Name of the company

    Returns:
        str: UUID if found, None if not found
    """
    try:
        url = "https://api.crunchbase.com/api/v4/autocompletes"
        headers = {"X-cb-user-key": CRUNCHBASE_API_KEY}
        params = {
            "query": company_name,
            "collection_ids": "organization.companies",
            "limit": 1,
        }

        print(f"Fetching UUID for company: {company_name}")
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()

        if data.get("entities") and len(data["entities"]) > 0:
            uuid = data["entities"][0]["identifier"]["uuid"]
            print(f"Found UUID: {uuid}")
            return uuid

        print(f"No UUID found for company: {company_name}")
        return None

    except requests.exceptions.RequestException as e:
        print(f"Error fetching UUID: {str(e)}")
        return None


def get_linkedin_url_from_crunchbase(company_name: str) -> Optional[str]:
    """
    Get LinkedIn URL for a company from Crunchbase API.

    Args:
        company_name: Name of the company

    Returns:
        str: LinkedIn URL if found, None if not found
    """
    try:
        uuid = get_uuid_from_company_name(company_name)
        if not uuid:
            return None

        url = f"https://api.crunchbase.com/api/v4/entities/organizations/{uuid}"
        headers = {"X-cb-user-key": CRUNCHBASE_API_KEY}
        params = {"field_ids": "linkedin"}

        print(f"Fetching LinkedIn URL for UUID: {uuid}")
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()

        if data.get("properties") and data["properties"].get("linkedin"):
            linkedin_url = data["properties"]["linkedin"]["value"]
            print(f"Found LinkedIn URL: {linkedin_url}")
            return linkedin_url

        print(f"No LinkedIn URL found for UUID: {uuid}")
        return None

    except requests.exceptions.RequestException as e:
        print(f"Error fetching LinkedIn URL: {str(e)}")
        return None


def trigger_bright_data_crawl(linkedin_url: str) -> Optional[str]:
    """
    Trigger Bright Data crawl for a LinkedIn URL.

    Args:
        linkedin_url: LinkedIn company URL

    Returns:
        str: Snapshot ID if successful, None if failed
    """
    try:
        url = "https://api.brightdata.com/datasets/v3/trigger"
        params = {"dataset_id": "gd_l1vikfnt1wgvvqz95w", "format": "json"}

        headers = {
            "Authorization": f"Bearer {BRIGHTDATA_API_KEY}",
            "Content-Type": "application/json",
        }

        payload = [{"url": linkedin_url}]

        print(f"Triggering Bright Data crawl for: {linkedin_url}")
        response = requests.post(url, params=params, headers=headers, json=payload)
        response.raise_for_status()

        snapshot_id = response.json().get("snapshot_id")
        print(f"Received snapshot ID: {snapshot_id}")
        return snapshot_id

    except requests.exceptions.RequestException as e:
        print(f"Error triggering crawl: {str(e)}")
        return None


def check_crawl_status(snapshot_id: str) -> str:
    """
    Check status of a Bright Data crawl.

    Args:
        snapshot_id: The snapshot ID to check

    Returns:
        str: Status of the crawl ('running', 'ready', or 'failed')
    """
    url = f"https://api.brightdata.com/datasets/v3/progress/{snapshot_id}"
    headers = {"Authorization": f"Bearer {BRIGHTDATA_API_KEY}"}

    response = requests.get(url, headers=headers)
    response.raise_for_status()

    status = response.json()["status"]
    print(f"Snapshot {snapshot_id} status: {status}")
    return status


def fetch_snapshot_data(snapshot_id: str) -> Optional[Dict]:
    """
    Fetch data for a completed snapshot.

    Args:
        snapshot_id: The snapshot ID to fetch

    Returns:
        Dict: Snapshot data if successful, None if failed
    """
    url = f"https://api.brightdata.com/datasets/v3/snapshot/{snapshot_id}"
    headers = {"Authorization": f"Bearer {BRIGHTDATA_API_KEY}"}
    params = {"format": "json"}

    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    return response.json()


def get_company_data(company_name: str) -> Optional[CompanyData]:
    """
    Get company data using both Crunchbase and Bright Data APIs.

    Args:
        company_name: Name of the company

    Returns:
        Dict: Company data if successful, None if failed
    """
    # Get LinkedIn URL from Crunchbase
    linkedin_url = get_linkedin_url_from_crunchbase(company_name)
    if not linkedin_url:
        print(f"Could not find LinkedIn URL for company: {company_name}")
        return None

    # Trigger the Bright Data crawl
    snapshot_id = trigger_bright_data_crawl(linkedin_url)
    if not snapshot_id:
        return None

    # Wait for completion
    while True:
        status = check_crawl_status(snapshot_id)
        if status == "ready":
            break
        elif status == "failed":
            print(f"Snapshot {snapshot_id} failed")
            return None
        print("Waiting 2 seconds before checking again...")
        time.sleep(2)

    # Fetch the data
    try:
        data = fetch_snapshot_data(snapshot_id)
        return CompanyData.from_brightdata_snapshot(data[0])
    except requests.exceptions.RequestException as e:
        print(f"Error fetching snapshot data: {str(e)}")
        return None


if __name__ == "__main__":
    # Example usage
    company_name = "langchain"
    result = get_company_data(company_name)

    if result:
        print("Company data:", result)
    else:
        print(f"Failed to fetch data for company: {company_name}")

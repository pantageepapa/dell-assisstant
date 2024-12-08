from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime
import re
from typing import Dict, Any


@dataclass
class Update:
    likes_count: int
    text: str
    time: str
    title: str
    comments_count: int
    post_url: str
    post_id: str
    images: Optional[List[str]] = None


@dataclass
class CompanyData:
    name: str
    locations: List[str]
    followers: int
    employees_in_linkedin: int
    about: str
    company_size: str
    organization_type: str
    industries: str
    website: str
    crunchbase_url: Optional[str]
    company_id: str
    employees: List[Dict[str, Any]]
    image: Optional[str]
    logo: str
    similar: List[Dict[str, Any]]
    url: str
    updates: List[Update]
    funding: Optional[Dict[str, Any]]
    investors: Optional[List[str]]
    description: str
    timestamp: datetime

    @classmethod
    def from_brightdata_snapshot(cls, snapshot: Dict[str, Any]) -> "CompanyData":
        """
        Create a CompanyData instance from a Bright Data snapshot.
        """
        # Handle funding data
        funding_data = snapshot.get("funding")
        funding = None
        if funding_data:
            funding = funding_data

        # Handle employees
        employees = [emp for emp in snapshot.get("employees", [])]

        # Handle similar companies
        similar = [comp for comp in snapshot.get("similar", [])]

        # Handle updates
        updates = [
            Update(
                likes_count=update["likes_count"],
                text=update["text"],
                time=update["time"],
                title=update["title"],
                comments_count=update["comments_count"],
                post_url=update["post_url"],
                post_id=update["post_id"],
                images=update.get("images"),
            )
            for update in snapshot.get("updates", [])
        ]

        return cls(
            name=snapshot["name"],
            locations=snapshot.get("locations", []),
            followers=snapshot["followers"],
            employees_in_linkedin=snapshot["employees_in_linkedin"],
            about=snapshot["about"],
            company_size=snapshot["company_size"],
            organization_type=snapshot["organization_type"],
            industries=snapshot["industries"],
            website=snapshot["website"],
            crunchbase_url=snapshot.get("crunchbase_url"),
            company_id=snapshot["company_id"],
            employees=employees,
            image=snapshot.get("image"),
            logo=snapshot["logo"],
            similar=similar,
            url=snapshot["url"],
            updates=updates,
            funding=funding,
            investors=snapshot.get("investors", []),
            description=snapshot["description"],
            timestamp=datetime.fromisoformat(snapshot["timestamp"]),
        )

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert the CompanyData instance to a dictionary format similar to your extract_linkedin_organisation_from_snapshots function.
        """
        return {
            "private_id": self.company_id,
            "name": self.name,
            "domain": get_domain(self.website) if self.website else None,
            "short_description": self.description,
            "long_description": self.about,
            "logo_url": self.logo,
            "followers": self.followers,
            "headcount": self.employees_in_linkedin,
            "industry": self.industries,
            "locations": self.locations,
            "latest_posts": [update.__dict__ for update in self.updates],
            "scraped_at": self.timestamp.isoformat(),
            "updated_at": "now()",
            "requested_endpoint": self.url,
            "similar_pages": [similar.__dict__ for similar in self.similar],
            "employees": [employee.__dict__ for employee in self.employees],
            "public_endpoint": self.url,
        }


def get_domain(url: str) -> Optional[str]:
    """Extract domain from URL."""
    if not url:
        return None
    pattern = r"https?://(?:www\.)?([^/]+)"
    match = re.match(pattern, url)
    return match.group(1) if match else None

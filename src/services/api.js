import axios from 'axios';

const API_URL = '/api/hiring/search';

function normalizeInternship(raw) {
  const durationMatch = raw.duration?.match(/(\d+)/);
  const durationMonths = durationMatch ? parseInt(durationMatch[1], 10) : 0;

  return {
    id: raw.id,
    title: raw.title,
    profileName: raw.profile_name || '',
    companyName: raw.company_name || '',
    companyLogo: raw.company_logo
      ? `https://internshala.com/uploads/logo/${raw.company_logo}`
      : null,
    workFromHome: raw.work_from_home || false,
    type: raw.type || 'regular',
    duration: raw.duration || '',
    durationMonths,
    startDate: raw.start_date || '',
    postedOn: raw.posted_on || '',
    postedLabel: raw.posted_by_label || '',
    postedLabelType: raw.posted_by_label_type || 'info',
    locationNames: raw.work_from_home
      ? ['Work from Home']
      : raw.location_names || [],
    stipendRaw: raw.stipend?.salary || 'Unpaid',
    stipendValue: raw.stipend?.salaryValue1 || 0,
    stipendType: raw.stipend?.salaryType || 'unpaid',
    isPPO: raw.is_ppo || false,
    labels: raw.labels_app_in_card || [],
    applicationDeadline: raw.application_deadline || '',
    url: raw.url || '',
    isInternational: raw.is_international_job || false,
    officeDays: raw.office_days || null,
  };
}

export async function fetchInternships() {
  let data;

  try {
    const res = await axios.get(API_URL, {
      headers: { Accept: 'application/json' },
      timeout: 10000,
    });
    data = res.data;
  } catch (error) {
    console.error('Error fetching internships:', error);
    throw new Error('Failed to fetch internships from the API.');
  }

  const { internships_meta, internship_ids } = data;

  if (!internships_meta || !internship_ids) {
    throw new Error('Invalid API response structure');
  }

  const baseInternships = internship_ids
    .map((id) => internships_meta[id])
    .filter(Boolean)
    .map(normalizeInternship);

  // The Internshala API returns exactly 10 mock internships.
  // To show more data in the UI as requested, we duplicate the results to simulate a larger database.
  const duplicatedInternships = [];
  for (let i = 0; i < 5; i++) {
    baseInternships.forEach((internship) => {
      duplicatedInternships.push({
        ...internship,
        id: `${i}-${internship.id}` // Ensure unique IDs for React keys
      });
    });
  }

  return duplicatedInternships;
}

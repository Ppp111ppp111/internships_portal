export function filterByProfile(internships, query) {
  if (!query) return internships;
  const q = query.toLowerCase().trim();
  return internships.filter(
    (i) =>
      i.profileName.toLowerCase().includes(q) ||
      i.title.toLowerCase().includes(q) ||
      i.companyName.toLowerCase().includes(q)
  );
}

export function filterByLocation(internships, locations, workFromHome) {
  if ((!locations || locations.length === 0) && !workFromHome) return internships;
  const selected = new Set((locations || []).map((l) => l.toLowerCase()));

  return internships.filter((i) => {
    if (workFromHome && i.workFromHome) return true;
    if (locations && locations.length > 0) {
      return i.locationNames.some((loc) => selected.has(loc.toLowerCase()));
    }
    return false;
  });
}

export function filterByPartTime(internships, partTime) {
  if (!partTime) return internships;
  return internships.filter((i) => i.partTime || i.type?.toLowerCase().includes('part time') || i.labels?.some(l => l.toLowerCase().includes('part time')));
}

export function filterByKeyword(internships, keyword) {
  if (!keyword) return internships;
  const q = keyword.toLowerCase().trim();
  return internships.filter(
    (i) =>
      i.title.toLowerCase().includes(q) ||
      i.companyName.toLowerCase().includes(q) ||
      i.profileName?.toLowerCase().includes(q) ||
      i.locationNames.some((loc) => loc.toLowerCase().includes(q))
  );
}

export function filterByDuration(internships, maxMonths) {
  if (!maxMonths || maxMonths === 0) return internships;
  return internships.filter((i) => i.durationMonths <= maxMonths);
}

export function filterByStipend(internships, minStipend) {
  if (!minStipend || minStipend === 0) return internships;
  return internships.filter((i) => i.stipendValue >= minStipend);
}

export function filterByJobOffer(internships, jobOffer) {
  if (!jobOffer) return internships;
  return internships.filter((i) => i.isPPO || i.labels?.some(l => l.toLowerCase().includes('job offer')));
}

export function filterByFastResponse(internships, fastResponse) {
  if (!fastResponse) return internships;
  return internships.filter((i) => i.labels?.some(l => l.toLowerCase().includes('fast response')));
}

export function filterByEarlyApplicant(internships, earlyApplicant) {
  if (!earlyApplicant) return internships;
  return internships.filter((i) => i.labels?.some(l => l.toLowerCase().includes('early applicant')));
}

export function filterByWomen(internships, women) {
  if (!women) return internships;
  return internships.filter((i) => i.segment === 'internship_for_women' || i.labels?.some(l => l.toLowerCase().includes('women')));
}

export function filterByStartDate(internships, startDate) {
  if (!startDate) return internships;
  
  const filterDate = new Date(startDate);
  filterDate.setHours(0, 0, 0, 0);
  const filterTime = filterDate.getTime();
  
  return internships.filter((i) => {
    // We use the hidden startDateComparison field mapped from start_date_comparison_format
    if (i.startDateComparison) {
      const itemDate = new Date(i.startDateComparison);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate.getTime() >= filterTime;
    }
    // If no parsable start date is provided, keep it to avoid false negatives
    return true;
  });
}

export function applyFilters(internships, filters) {
  let result = internships;
  result = filterByProfile(result, filters.profile);
  result = filterByLocation(result, filters.locations, filters.workFromHome);
  result = filterByPartTime(result, filters.partTime);
  result = filterByDuration(result, filters.duration);
  result = filterByStipend(result, filters.stipend);
  result = filterByKeyword(result, filters.keyword);
  result = filterByJobOffer(result, filters.jobOffer);
  result = filterByFastResponse(result, filters.fastResponse);
  result = filterByEarlyApplicant(result, filters.earlyApplicant);
  result = filterByWomen(result, filters.women);
  result = filterByStartDate(result, filters.startDate);
  return result;
}

export function sortInternships(internships, sortBy) {
  if (!sortBy || sortBy === 'relevance') return internships;

  const sorted = [...internships];

  switch (sortBy) {
    case 'stipend_desc':
      sorted.sort((a, b) => b.stipendValue - a.stipendValue);
      break;
    case 'stipend_asc':
      sorted.sort((a, b) => a.stipendValue - b.stipendValue);
      break;
    case 'duration_asc':
      sorted.sort((a, b) => a.durationMonths - b.durationMonths);
      break;
    default:
      break;
  }

  return sorted;
}

export function extractUniqueLocations(internships) {
  const locationSet = new Set();
  internships.forEach((i) => {
    i.locationNames.forEach((loc) => {
      if (loc !== 'Work from Home') locationSet.add(loc);
    });
  });
  return Array.from(locationSet).sort();
}

export function extractUniqueProfiles(internships) {
  const profileSet = new Set();
  internships.forEach((i) => {
    if (i.profileName) profileSet.add(i.profileName);
  });
  return Array.from(profileSet).sort();
}

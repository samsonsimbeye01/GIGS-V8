export const jobCategories = {
  'skilled-labour': {
    emoji: '🔨',
    name: 'Skilled Labour',
    jobs: [
      { type: 'Mason', description: 'Bricklaying, plastering, and cement work for construction sites.' },
      { type: 'Electrician', description: 'House wiring, small repairs, solar panel installation.' },
      { type: 'Plumber', description: 'Pipe installations, leak repairs, and toilet setups.' },
      { type: 'Painter', description: 'House painting, wall art, or roof coatings.' },
      { type: 'Welding Technician', description: 'Metal gates, door repairs, custom fabrication.' },
      { type: 'Tiler', description: 'Floor and wall tile installation for homes and offices.' }
    ]
  },
  'domestic-services': {
    emoji: '🧹',
    name: 'Domestic Services',
    jobs: [
      { type: 'House Cleaner', description: 'Daily or weekly cleaning of homes, apartments, or offices.' },
      { type: 'Laundry Worker', description: 'Handwashing or using machines in urban areas.' },
      { type: 'Cook / Caterer', description: 'Hired for family meals or event catering on a per-day basis.' },
      { type: 'Child Minder', description: 'Temporary babysitting services (half-day/full-day).' },
      { type: 'Elderly Companion', description: 'Care and companionship for senior citizens.' }
    ]
  },
  'delivery-errands': {
    emoji: '📦',
    name: 'Delivery & Errands',
    jobs: [
      { type: 'Delivery Rider', description: 'Motorcycle delivery of parcels, documents, food, etc.' },
      { type: 'Errand Runner', description: 'Picking up groceries, queuing at offices, or bill payments.' },
      { type: 'Courier Assistant', description: 'Helping established courier firms on high-volume days.' }
    ]
  },
  'agricultural-outdoor': {
    emoji: '🌱',
    name: 'Agricultural and Outdoor Work',
    jobs: [
      { type: 'Farm Helper', description: 'Planting, weeding, harvesting on smallholder farms.' },
      { type: 'Garden Worker', description: 'Lawn maintenance, tree pruning, and composting.' },
      { type: 'Livestock Attendant', description: 'Daycare for poultry, goats, or cattle.' },
      { type: 'Water Fetcher', description: 'For households or businesses without direct water access.' }
    ]
  },
  'transport-moving': {
    emoji: '🚗',
    name: 'Transport & Moving',
    jobs: [
      { type: 'Mover / Porter', description: 'Lifting and transporting household or office goods.' },
      { type: 'Day Driver', description: 'Using personal or hired car for school runs, errands, or hire.' },
      { type: 'Boda Boda (Bike Taxi) Rider', description: 'Common in East Africa for passenger or light cargo movement.' }
    ]
  },
  'repairs-maintenance': {
    emoji: '🛠️',
    name: 'Repairs & Maintenance',
    jobs: [
      { type: 'Phone Technician', description: 'Screen replacements, charging port repair, etc.' },
      { type: 'Shoe or Bag Repairer', description: 'Leather fixing and quick cobbling jobs.' },
      { type: 'Tailor (On-call)', description: 'Stitching, alterations, curtain setups.' },
      { type: 'AC/Fridge Repair', description: 'Appliance diagnosis and repair (often freelance).' }
    ]
  },
  'education-services': {
    emoji: '📚',
    name: 'Education & Services',
    jobs: [
      { type: 'Tutor (Home-based)', description: 'Math, English, or science tutoring (primary/secondary).' },
      { type: 'Computer Instructor', description: 'Basic skills training in Word, Excel, typing.' },
      { type: 'Event MC/DJ', description: 'Short-term gigs for parties, weddings, and ceremonies.' },
      { type: 'Makeup Artist / Hair Stylist', description: 'On-call beauty services, often mobile.' }
    ]
  },
  'office-support': {
    emoji: '🧾',
    name: 'Office & Support',
    jobs: [
      { type: 'Data Entry Clerk', description: 'Part-time digitization or typing assignments.' },
      { type: 'Temporary Receptionist', description: 'Filling in at salons, clinics, or shops.' },
      { type: 'Market Survey Assistant', description: 'Helping NGOs or companies collect field data.' }
    ]
  },
  'creative-digital': {
    emoji: '📣',
    name: 'Creative & Digital',
    jobs: [
      { type: 'Graphic Designer', description: 'Logo, poster, or event material design (remote or in-person).' },
      { type: 'Social Media Assistant', description: 'Day-to-day account management for small brands.' },
      { type: 'Photographer/Videographer', description: 'Events, product shoots, or promo videos.' }
    ]
  }
};

export const getAllJobTypes = () => {
  return Object.values(jobCategories).flatMap(category => 
    category.jobs.map(job => ({
      ...job,
      category: category.name,
      categoryKey: Object.keys(jobCategories).find(key => jobCategories[key as keyof typeof jobCategories] === category)
    }))
  );
};
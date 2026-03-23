// B.E. ECE - Anna University Regulations 2021
// Credits data extracted from the official curriculum PDF
// Source: B.E.ECE.pdf

export interface CourseCredit {
  code: string;
  title: string;
  credits: number;
  semester: number;
}

// Map of course title keywords/variations to credits
// This allows fuzzy matching with subject names from uploaded Excel files
export const eceCreditsByCode: Record<string, number> = {
  // Semester I
  "IP3151": 0,
  "HS3152": 3,
  "MA3151": 4,
  "PH3151": 3,
  "CY3151": 3,
  "GE3151": 3,
  "GE3152": 1,
  "GE3171": 2,
  "BS3171": 2,
  "GE3172": 1,

  // Semester II
  "HS3252": 2,
  "MA3251": 4,
  "PH3254": 3,
  "BE3254": 3,
  "GE3251": 4,
  "EC3251": 4,
  "GE3252": 1,
  "GE3271": 2,
  "EC3271": 1,
  "GE3272": 2,

  // Semester III
  "MA3355": 4,
  "CS3353": 3,
  "EC3354": 4,
  "EC3353": 3,
  "EC3351": 3,
  "EC3352": 4,
  "EC3361": 1.5,
  "CS3362": 1.5,
  "GE3361": 1,

  // Semester IV
  "EC3452": 3,
  "EC3401": 4,
  "EC3451": 3,
  "EC3492": 4,
  "EC3491": 3,
  "GE3451": 2,
  "EC3461": 1.5,
  "EC3462": 1.5,

  // Semester V
  "EC3501": 4,
  "EC3552": 3,
  "EC3551": 3,
  "EC3561": 2,

  // Semester VI
  "ET3491": 4,
  "CS3491": 4,

  // Semester VII/VIII
  "GE3791": 2,
  "EC3711": 2,

  // Semester VIII/VII
  "EC3811": 10,

  // Professional Elective Courses (all 3 credits)
  "CEC363": 3, "CEC361": 3, "CEC370": 3, "CEC362": 3, "CEC342": 3, "CEC334": 3,
  "CEC332": 3, "CEC366": 3, "CEC356": 3, "CEC355": 3, "CEC337": 3, "CCS338": 3,
  "CEC350": 3, "CEC353": 3, "CEC335": 3, "CEC341": 3, "CEC338": 3, "CEC349": 3,
  "CBM370": 3, "CBM352": 3, "CBM368": 3, "CBM355": 3, "CBM342": 3, "CBM341": 3,
  "CEC359": 3, "CEC358": 3, "CEC357": 3, "CEC344": 3, "CEC360": 3, "CEC343": 3,
  "CEC369": 3, "CEC368": 3, "CEC365": 3, "CEC367": 3, "CEC340": 3, "CEC339": 3,
  "CEC347": 3, "CEC336": 3, "CEC346": 3, "CEC352": 3, "CEC348": 3, "CEC351": 3,
  "CEC345": 3, "CEC364": 3, "CEC331": 3, "CEC354": 3, "CEC371": 3, "CEC333": 3,

  // Open Elective Courses (all 3 credits)
  "OAS351": 3, "OIE351": 3, "OBT351": 3, "OCE351": 3, "OEE351": 3, "OEI351": 3,
  "OMA351": 3, "CCS355": 3, "CCW332": 3,
  "OIE352": 3, "OMG351": 3, "OFD351": 3, "AI3021": 3, "OEI352": 3, "OPY351": 3,
  "OAE351": 3, "CCS342": 3, "CCS361": 3,
  "OHS351": 3, "OMG352": 3, "OMG353": 3, "CME365": 3, "OME354": 3, "MF3003": 3,
  "OPR351": 3, "AU3791": 3, "OAS352": 3, "OIM351": 3, "OIE354": 3, "OSF351": 3,
  "OML351": 3, "OMR351": 3, "ORA351": 3, "OAE352": 3, "OGI351": 3, "OAI351": 3,
  "OEN351": 3, "OEE352": 3, "OEI353": 3, "OCH351": 3, "OCH352": 3, "OFD352": 3,
  "OFD353": 3, "OPY352": 3, "OTT351": 3, "OTT352": 3, "OTT353": 3, "OPE351": 3,
  "CPE334": 3, "OPT351": 3, "CBM348": 3, "CBM333": 3, "OMA352": 3, "OMA353": 3,
  "OMA354": 3, "OCE353": 3, "OBT352": 3, "OBT353": 3, "OBT354": 3,
  "OHS352": 3, "OMA355": 3, "OMA356": 3, "OMA357": 3, "OMG354": 3, "OMG355": 3,
  "OME352": 3, "CME343": 3, "OME355": 3, "MF3010": 3, "OMF354": 3, "AU3002": 3,
  "AU3008": 3, "OAS353": 3, "OIM352": 3, "OIM353": 3, "OIE353": 3, "OSF352": 3,
  "OSF353": 3, "OML352": 3, "OML353": 3, "OMR352": 3, "OMR353": 3, "ORA352": 3,
  "MV3501": 3, "OMV351": 3, "OMV352": 3, "CRA332": 3, "OGI352": 3, "OAI352": 3,
  "OEN352": 3, "OEE353": 3, "OEI354": 3, "OCH353": 3, "OCH354": 3, "OFD354": 3,
  "OFD355": 3, "OPY353": 3, "OTT354": 3, "FT3201": 3, "OTT355": 3, "OPE353": 3,
  "OPE354": 3, "OPT352": 3, "OPT353": 3, "CBM356": 3, "OCE354": 3, "OBT355": 3,
  "OBT356": 3, "OBT357": 3,

  // Elective Management Courses (all 3 credits)
  "GE3751": 3, "GE3752": 3, "GE3753": 3, "GE3754": 3, "GE3755": 3, "GE3792": 3,

  // Minor Degree Verticals (all 3 credits)
  "CMG331": 3, "CMG332": 3, "CMG333": 3, "CMG334": 3, "CMG335": 3, "CMG336": 3,
  "CMG337": 3, "CMG338": 3, "CMG339": 3, "CMG340": 3, "CMG341": 3, "CMG342": 3,
  "CMG343": 3, "CMG344": 3, "CMG345": 3, "CMG346": 3, "CMG347": 3, "CMG348": 3,
  "CMG349": 3, "CMG350": 3, "CMG351": 3, "CMG352": 3, "CMG353": 3, "CMG354": 3,
  "CES331": 3, "CES332": 3, "CES333": 3, "CES334": 3, "CES335": 3, "CES336": 3,
  "CES337": 3, "CES338": 3,
};

// Map of course title (normalized lowercase) to credits for title-based matching
export const eceCreditsByTitle: Record<string, number> = {
  // Semester I
  "induction programme": 0,
  "professional english - i": 3,
  "professional english i": 3,
  "professional english -i": 3,
  "professional english-i": 3,
  "matrices and calculus": 4,
  "engineering physics": 3,
  "engineering chemistry": 3,
  "problem solving and python programming": 3,
  "heritage of tamils": 1,
  "problem solving and python programming laboratory": 2,
  "physics and chemistry laboratory": 2,
  "english laboratory": 1,

  // Semester II
  "professional english - ii": 2,
  "professional english ii": 2,
  "professional english -ii": 2,
  "professional english-ii": 2,
  "statistics and numerical methods": 4,
  "physics for electronics engineering": 3,
  "electrical and instrumentation engineering": 3,
  "engineering graphics": 4,
  "circuit analysis": 4,
  "tamils and technology": 1,
  "engineering practices laboratory": 2,
  "circuits analysis laboratory": 1,
  "communication laboratory / foreign language": 2,
  "communication laboratory": 2,
  "foreign language": 2,

  // Semester III
  "random processes and linear algebra": 4,
  "c programming and data structures": 3,
  "signals and systems": 4,
  "electronic devices and circuits": 3,
  "control systems": 3,
  "digital systems design": 4,
  "electronic devices and circuits laboratory": 1.5,
  "c programming and data structures laboratory": 1.5,
  "professional development": 1,

  // Semester IV
  "electromagnetic fields": 3,
  "networks and security": 4,
  "embedded systems and iot design": 4,
  "linear integrated circuits": 3,
  "digital signal processing": 4,
  "communication systems": 3,
  "environmental sciences and sustainability": 2,
  "communication systems laboratory": 1.5,
  "linear integrated circuits laboratory": 1.5,

  // Semester V
  "wireless communication": 4,
  "vlsi and chip design": 3,
  "transmission lines and rf systems": 3,
  "vlsi laboratory": 2,

  // Semester VI
  "artificial intelligence and machine learning": 4,
  "telecommunication switching and transmission": 3,

  // Semester VII/VIII
  "human values and ethics": 2,
  "summer internship": 2,

  // Semester VIII/VII
  "project work / internship": 10,
  "project work": 10,
  "internship": 10,

  // Elective Management
  "principles of management": 3,
  "total quality management": 3,
  "engineering economics and financial accounting": 3,
  "human resource management": 3,
  "knowledge management": 3,
  "industrial management": 3,

  // Professional Electives (all 3 credits)
  "wide bandgap devices": 3,
  "validation and testing technology": 3,
  "low power ic design": 3,
  "vlsi testing and design for testability": 3,
  "mixed signal ic design testing": 3,
  "analog ic design": 3,
  "advanced digital signal processing": 3,
  "image processing": 3,
  "speech processing": 3,
  "software defined radio": 3,
  "dsp architecture and programming": 3,
  "computer vision": 3,
  "rf transceivers": 3,
  "signal integrity": 3,
  "antenna design": 3,
  "mics and rf system design": 3,
  "emi/emc pre compliance testing": 3,
  "rfid system design and testing": 3,
  "wearable devices": 3,
  "human assist devices": 3,
  "therapeutic equipment": 3,
  "medical imaging systems": 3,
  "brain computer interface and applications": 3,
  "body area networks": 3,
  "underwater instrumentation system": 3,
  "underwater imaging systems and image processing": 3,
  "underwater communication": 3,
  "ocean observation systems": 3,
  "underwater navigation systems": 3,
  "ocean acoustics": 3,
  "iot processors": 3,
  "iot based systems design": 3,
  "iot based system design": 3,
  "wireless sensor network design": 3,
  "industrial iot and industry 4.0": 3,
  "mems design": 3,
  "fundamentals of nanoelectronics": 3,
  "radar technologies": 3,
  "avionics systems": 3,
  "positioning and navigation systems": 3,
  "satellite communication": 3,
  "remote sensing": 3,
  "rocketry and space mechanics": 3,
  "optical communication & networks": 3,
  "optical communication and networks": 3,
  "wireless broad band networks": 3,
  "4g/5g communication networks": 3,
  "software defined networks": 3,
  "massive mimo networks": 3,
  "advanced wireless communication techniques": 3,
};

/**
 * Attempts to match a subject name from the uploaded Excel file
 * to the ECE credits database. Returns the credit value if found,
 * or undefined if not found.
 */
export function findCreditsForSubject(subjectName: string): number | undefined {
  const normalized = subjectName.trim();

  // 1. Try exact code match (e.g., "MA3151", "EC3251")
  if (eceCreditsByCode[normalized]) {
    return eceCreditsByCode[normalized];
  }

  // 2. Try to extract course code from the subject name
  // Pattern: alphanumeric code like XX1234 or XXX1234
  const codeMatch = normalized.match(/[A-Z]{2,3}\d{4}/i);
  if (codeMatch) {
    const code = codeMatch[0].toUpperCase();
    if (eceCreditsByCode[code] !== undefined) {
      return eceCreditsByCode[code];
    }
  }

  // 3. Try title-based matching (case-insensitive)
  const lowerName = normalized.toLowerCase();
  if (eceCreditsByTitle[lowerName] !== undefined) {
    return eceCreditsByTitle[lowerName];
  }

  // 4. Try partial matching - check if the subject name contains
  // or is contained in any known title
  for (const [title, credits] of Object.entries(eceCreditsByTitle)) {
    if (lowerName.includes(title) || title.includes(lowerName)) {
      return credits;
    }
  }

  // 5. Try matching after removing common prefixes/suffixes
  const cleanedName = lowerName
    .replace(/\s*\(.*?\)\s*/g, '') // Remove parenthetical text
    .replace(/\s*-\s*/g, ' ')      // Replace hyphens with spaces
    .replace(/\s+/g, ' ')          // Normalize whitespace
    .trim();

  if (eceCreditsByTitle[cleanedName] !== undefined) {
    return eceCreditsByTitle[cleanedName];
  }

  for (const [title, credits] of Object.entries(eceCreditsByTitle)) {
    const cleanedTitle = title
      .replace(/\s*-\s*/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleanedName.includes(cleanedTitle) || cleanedTitle.includes(cleanedName)) {
      return credits;
    }
  }

  return undefined;
}

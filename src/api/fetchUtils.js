
export const fetchDrugsByName = async (name) => {
    const response = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${name}`);
    if (!response.ok) {
      throw new Error('Failed to fetch drug information');
    }
    const data = await response.json();
    if (data.drugGroup && data.drugGroup.conceptGroup) {
      const sbdGroup = data.drugGroup.conceptGroup.find(group => group.tty === 'SBD');
      if (sbdGroup && sbdGroup.conceptProperties) {
        return sbdGroup.conceptProperties.map(prop => ({
          rxcui: prop.rxcui,
          name: prop.name,
          synonym: prop.synonym,
        }));
      }
    }
    return [];
};

export const fetchDrugDetails = async (rxcui, name) => {
    const response = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${encodeURIComponent(rxcui)}/ndcs.json`);
    if (!response.ok) {
      throw new Error('Failed to fetch drug details');
    }
    const data = await response.json();
    return data.ndcGroup.ndcList.ndc || [];
};

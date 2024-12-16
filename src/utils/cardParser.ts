export function parseBusinessCardText(text: string) {
  const lines = text.split('\n').filter(line => line.trim());
  const phoneMatch = text.match(/(\d{2,4}[-\s]?\d{2,4}[-\s]?\d{3,4})/);
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  
  return {
    name: lines[0] || '',
    company: lines[1] || '',
    title: lines[2] || '',
    phone: phoneMatch ? phoneMatch[0] : '',
    email: emailMatch ? emailMatch[0] : '',
    address: lines.slice(-2).join(' '),
  };
}
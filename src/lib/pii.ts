export function maskEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const parts = email.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return email;
  const username = parts[0];
  const domain = parts[1];
  
  if (username.length <= 2) {
    return `***@${domain}`;
  }
  return `${username[0]}***${username[username.length - 1]}@${domain}`;
}

export function maskPhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  if (phone.length < 6) return '***';
  const visible = phone.slice(-4);
  const hidden = phone.slice(0, -4).replace(/[\d]/g, '*');
  return `${hidden}${visible}`;
}

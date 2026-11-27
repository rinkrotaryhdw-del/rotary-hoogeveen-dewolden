// Stuurt bezoekers van www. en van het pages.dev-adres door naar het hoofddomein,
// zodat de site (en het inloggen op het beheerscherm) op één adres werkt.
const HOOFDDOMEIN = 'rotarydewoldenhoogeveen.nl';
const DOORSTUREN = new Set(['www.rotarydewoldenhoogeveen.nl', 'rotary-hoogeveen-dewolden.pages.dev']);

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (DOORSTUREN.has(url.hostname)) {
    url.hostname = HOOFDDOMEIN;
    url.protocol = 'https:';
    url.port = '';
    return Response.redirect(url.toString(), 301);
  }
  return next();
}

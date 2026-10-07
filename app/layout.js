import './globals.css';
export const metadata = { title: 'Split the Check', description: 'Enter the bill, pick a tip, see what everyone owes' };
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}

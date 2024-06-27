interface EmailTemplateProps {
  firstName: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div className="bg-slate-500">
    <h1 className="text-4xl font-bold">Welcome, {firstName}!</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, at.</p>
    <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
      <a href="https://www.google.com">Click me</a>
    </button>
  </div>
)

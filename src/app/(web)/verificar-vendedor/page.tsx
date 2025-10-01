import VerifyForm from './VerifyForm';

export default function VerificarVendedorPage() {
  return (
    <div className="container mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Verificar vendedor</h1>
      <p className="text-sm text-gray-600 mb-4">Ingresa el código de verificación (válido por 1 minuto y de un solo uso).</p>
      <VerifyForm />
    </div>
  );
}

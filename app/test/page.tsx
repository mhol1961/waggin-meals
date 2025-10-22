export default function TestPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', background: 'yellow' }}>
      <h1 style={{ fontSize: '48px', color: 'red' }}>
        TEST PAGE - {new Date().toLocaleTimeString()}
      </h1>
      <p style={{ fontSize: '24px' }}>
        If you see this YELLOW page, your browser is connected to the dev server!
      </p>
    </div>
  );
}

export default function DiagnosticPage() {
  const timestamp = new Date().toISOString();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FF0000',
      color: '#FFFFFF',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '40px' }}>
        ✅ SERVER IS WORKING!
      </h1>
      <p style={{ fontSize: '36px', marginBottom: '20px' }}>
        You are successfully connected to the Next.js dev server
      </p>
      <p style={{ fontSize: '24px', marginBottom: '40px' }}>
        Server started at: {timestamp}
      </p>
      <div style={{
        backgroundColor: '#FFFF00',
        color: '#000000',
        padding: '30px',
        borderRadius: '10px',
        fontSize: '20px',
        maxWidth: '600px'
      }}>
        <p style={{ marginBottom: '15px' }}>
          <strong>If you see this page, your connection is working!</strong>
        </p>
        <p>
          Now go back to the home page at: <br />
          <strong>http://localhost:3000</strong>
        </p>
      </div>
    </div>
  );
}

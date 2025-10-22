'use client';

export function Newsletter() {
  return (
    <section className="bg-gradient-to-br from-[#a5b5eb] to-[#8a9fd9] px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-normal text-white mb-4" style={{ fontFamily: "'Abril Fatface', serif" }}>
            Join Our Pack!
          </h2>
          <p className="text-lg text-white/90" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Get exclusive nutrition tips, recipes, special offers, and updates delivered to your inbox.
          </p>
        </div>

        {/* GoHighLevel Newsletter Form Embed Placeholder */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="border-2 border-dashed border-[#a5b5eb] rounded-lg p-8 bg-[#f8f9fa]">
            <div className="text-center">
              <svg className="h-16 w-16 text-[#a5b5eb] mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <h3 className="text-xl font-semibold text-[#3c3a47] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Newsletter Signup Form
              </h3>
              <p className="text-[14px] text-[#666666] mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                The newsletter signup form will appear here once the GoHighLevel embed code is provided.
              </p>
              <div className="bg-white rounded p-4 text-left">
                <p className="text-[13px] text-[#999999] font-mono" style={{ fontFamily: "'Courier New', monospace" }}>
                  {`<!-- GHL Newsletter Embed Placeholder -->`}
                </p>
                <p className="text-[13px] text-[#999999] font-mono mt-2" style={{ fontFamily: "'Courier New', monospace" }}>
                  {`<!-- Insert your GoHighLevel newsletter -->`}
                </p>
                <p className="text-[13px] text-[#999999] font-mono mt-2" style={{ fontFamily: "'Courier New', monospace" }}>
                  {`<!-- signup form embed code here -->`}
                </p>
              </div>
              <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded text-left">
                <p className="text-[13px] text-[#666666]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <strong className="text-[#3c3a47]">Developer Note:</strong> To add your GoHighLevel newsletter form, replace the placeholder div above with your GHL newsletter embed code. Subscribers will be automatically added to your GHL CRM.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex flex-wrap justify-center gap-8 text-white/80 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span>No spam, ever</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
            </svg>
            <span>Weekly nutrition tips</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
            <span>Exclusive offers</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <span>Unsubscribe anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}

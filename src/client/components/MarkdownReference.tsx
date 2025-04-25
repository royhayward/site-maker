import React from 'react';

type MarkdownReferenceProps = {
  isOpen: boolean;
  onClose: () => void;
}

const MarkdownReference = ({ isOpen, onClose }: MarkdownReferenceProps) => {
  const references = [
    {
      markdown: '# Heading 1',
      description: 'Creates a top-level heading',
      example: '<h1>Heading 1</h1>'
    },
    {
      markdown: '## Heading 2',
      description: 'Creates a second-level heading',
      example: '<h2>Heading 2</h2>'
    },
    {
      markdown: '**Bold Text**',
      description: 'Makes text bold',
      example: '<strong>Bold Text</strong>'
    },
    {
      markdown: '*Italic Text*',
      description: 'Makes text italic',
      example: '<em>Italic Text</em>'
    },
    {
      markdown: '[Link Text](URL)',
      description: 'Creates a hyperlink',
      example: '<a href="URL">Link Text</a>'
    },
    {
      markdown: '![Alt Text](image.jpg)',
      description: 'Inserts an image',
      example: '<img src="image.jpg" alt="Alt Text">'
    },
    {
      markdown: '> Blockquote',
      description: 'Creates a blockquote',
      example: '<blockquote>Blockquote</blockquote>'
    },
    {
      markdown: '- List item\n- Another item',
      description: 'Creates an unordered list',
      example: '<ul>\n  <li>List item</li>\n  <li>Another item</li>\n</ul>'
    },
    {
      markdown: '1. First item\n2. Second item',
      description: 'Creates an ordered list',
      example: '<ol>\n  <li>First item</li>\n  <li>Second item</li>\n</ol>'
    },
    {
      markdown: '`inline code`',
      description: 'Creates inline code',
      example: '<code>inline code</code>'
    }
  ];

  return (
    <div
      className={`fixed top-0 right-0 h-full w-1/2 bg-gray-900 border-l border-gray-700 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } overflow-y-auto z-50`}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Markdown Reference</h2>
          <button
            onClick={() => {
              console.log('Close button clicked');
              onClose();
            }}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-6">
          {references.map((ref, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-2">Example {index + 1}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-400">Markdown:</p>
                  <pre className="bg-gray-700 p-2 rounded text-white font-mono text-sm whitespace-pre-wrap">
                    {ref.markdown}
                  </pre>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-400">HTML Output:</p>
                  <pre className="bg-gray-700 p-2 rounded text-white font-mono text-sm whitespace-pre-wrap">
                    {ref.example}
                  </pre>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">{ref.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarkdownReference;

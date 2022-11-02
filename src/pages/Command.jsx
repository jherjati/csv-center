import { useCallback, useRef } from "preact/hooks";
import { EditorView, basicSetup } from "codemirror";
import { sql } from "@codemirror/lang-sql";

function Command() {
  const editor = useRef();
  const ref = useCallback((node) => {
    editor.current = new EditorView({
      doc: `
SELECT 
  name 
FROM 
  sqlite_schema 
WHERE 
  type = 'table' 
  AND name NOT LIKE 'sqlite_%';
`,
      extensions: [basicSetup, sql()],
      parent: node,
    });
  }, []);

  return (
    <main className='py-6'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h1 className='text-2xl font-semibold text-gray-900'>Command</h1>
      </div>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 md:px-8'>
        {/* Replace with your content */}
        <div className='py-4'>
          <div ref={ref} className='border bg-white' />
        </div>
        {/* /End replace */}
      </div>
    </main>
  );
}

export default Command;

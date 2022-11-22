export default function Mobile() {
  return (
    <main className='lg:hidden bg-white h-screen w-full flex flex-col justify-center items-center p-8'>
      <div className='flex flex-shrink-0 justify-center'>
        <a href='/' className='inline-flex'>
          <span className='sr-only'>Your Company</span>
          <img
            className='h-24 w-auto'
            src='/android-chrome-512x512.png'
            alt=''
          />
        </a>
      </div>
      <div className='pt-8 pb-16'>
        <div className='text-center'>
          <p className='text-base font-semibold text-teal-600'>Oops</p>
          <h1 className='mt-2 text-4xl font-bold tracking-tight text-gray-900'>
            Limited Screen Space Detected
          </h1>
          <p className='mt-2 text-base text-gray-500'>
            Sorry, this application is intended for larger screen to optimize
            your data management experience
          </p>
        </div>
      </div>
    </main>
  );
}

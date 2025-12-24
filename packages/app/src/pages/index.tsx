import { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';

const PI_314 =
  '3.14159265358979323846264338327950288419716939937510' +
  '58209749445923078164062862089986280348253421170679' +
  '82148086513282306647093844609550582231725359408128' +
  '48111745028410270193852110555964462294895493038196' +
  '44288109756659334461284756482337867831652712019091' +
  '45648566923460348610454326648213393607260249141273' +
  '72458700660631558817488152092096282925409171536436' +
  '78925903600113305305488204665213841469519415116094' +
  '33057270365759591953092186117381932611793105118548' +
  '07446237996274956735188575272489122793818301194912' +
  '98336733624406566430860213949463952247371907021798' +
  '60943702770539217176293176752384674818467669405132' +
  '00056812714526356082778577134275778960917363717872' +
  '14684409012249534301465495853710507922796892589235' +
  '42019956112129021960864034418159813629774771309960' +
  '51870721134999999837297804995105973173281609631859' +
  '50244594553469083026425223082533446850352619311881' +
  '71010003137838752886587533208381420617177669147303' +
  '59825349042875546873115956286388235378759375195778' +
  '18577805321712268066130019278766111959092164201989';

const DIGIT_WIDTH = 24;
const VIEWPORT_OFFSET = 4 * DIGIT_WIDTH;

const HomePage: NextPage = () => {
  const digits = useMemo(() => PI_314.split(''), []);
  const [index, setIndex] = useState(0);

  // ✅ Theme init WITHOUT useEffect
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem('theme') as 'dark' | 'light') ?? 'dark';
  });

  // Apply theme + persist (this is fine)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setIndex((i) => Math.min(i + 1, digits.length - 1));
      }
      if (e.key === 'ArrowLeft') {
        setIndex((i) => Math.max(i - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [digits.length]);

  return (
    <div className="bg-base-100 text-base-content relative flex h-screen items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center gap-4">
        <button
          className="btn btn-ghost btn-xs"
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}>
          {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <div className="border-accent rounded-md border border-dashed px-4 py-2">
          <div className="relative h-12 w-54 overflow-hidden">
            <div
              className="absolute top-0 flex h-12 transition-[left] duration-300 ease-out"
              style={{ left: `${VIEWPORT_OFFSET - index * DIGIT_WIDTH}px` }}>
              {digits.map((d, i) => (
                <div
                  key={i}
                  className={[
                    'flex h-12 w-6 items-center justify-center text-4xl select-none',
                    i === index ? 'text-accent' : 'opacity-40',
                  ].join(' ')}>
                  {d}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 text-xs opacity-60">
          <div>Use ← → arrow keys</div>
          <div>Index: {index}</div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

import Village from './component/Village';
import background from './assets/BG/BG.png';
import BackgroundElements from './component/BackgroundElements';
import RotateScreen from './component/RotateScreen';

export default function CalendrierAvent() {
  return (
    <div
      className="relative w-full h-dvh bg-[#1b1947] bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${background})` }}
    >
      <BackgroundElements />
      <Village />
      <RotateScreen />
    </div>
  );
}
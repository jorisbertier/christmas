
import dunegauche from '../assets/3plan/Dune gauche.png';
import dunedroite from '../assets/3plan/Dune droite.png';
import dune3 from '../assets/3plan/Dune 3.png';
import dune4 from '../assets/3plan/Dune 4.png';
import nuage from '../assets/3plan/Nuage.png';
import subtract from '../assets/2plan/Subtract.png';
import firstplan from '../assets/1plan/1er plan.png';
import secondplan from '../assets/2plan/2e plan.png';
import LightGarland from './LightGarland';

export default function BackgroundElements() {
    return (
        <div className="absolute w-full sm:h-full pointer-events-none overflow-hidden">
        {/* Montagnes à l'arrière-plan */}
            <img
                src={dunegauche}
                alt=""
                className="absolute h-[58%] w-[46%] top-[17%] left-0"
            />

            <img
                src={dunedroite}
                alt=""
                className="absolute h-[58%] w-[46%] top-[17%] right-0"
            />

            <img
                src={dune3}
                alt=""
                className="absolute h-[58%] w-[34%] top-[14%] right-0"
            />

            <img
                src={dune4}
                alt=""
            className="absolute h-[45%] w-[35%] top-[30%] -left-10"
            />

            <img
                src={nuage}
                alt=""
                className="absolute h-[15%] w-[13%] top-[1%] left-[65%] -translate-x-1/2"
            />

            <img
                src={subtract}
                alt=""
                className="absolute h-[10%] w-[42%] bottom-[20%] left-1/2 -translate-x-1/2 z-20"
            />

            <img
                src={secondplan}
                alt=""
                className="absolute h-[50%] lg:h-[72%] w-[100%] bottom-0 left-1/2 -translate-x-1/2 z-20"
            />
            
            <div className="absolute bottom-0 inset-x-0 aspect-[1440/370]">
            <img
                src={firstplan}
                alt=""
                className="absolute h-[98%] w-full bottom-0 left-1/2 -translate-x-1/2 z-20"
            />
            {/* First fir */}
            <LightGarland numberBulbs={6} decale={false} className="w-[11%] bottom-[70%] left-0 rotate-[5deg] z-30" />
            <LightGarland numberBulbs={6} decale={true} className="w-[13%] bottom-[62%] left-0 rotate-[340deg] z-30" />
            <LightGarland numberBulbs={6} className="w-[14%] bottom-[35%] left-0 rotate-[5deg] z-30" />

            <LightGarland numberBulbs={6} decale={true} className="w-[9%] bottom-[48%] lg:bottom-[50%] left-[14%] rotate-[345deg] z-30" />
            <LightGarland numberBulbs={6} className="w-[9%] bottom-[30%] left-[14%] rotate-[5deg] z-30" />

            <LightGarland numberBulbs={6} className="w-[6%] bottom-[23%] lg:bottom-[27%] left-[21%] rotate-[350deg] lg:rotate-[335deg] z-30" />
            <LightGarland numberBulbs={6} decale={true} className="w-[9%] bottom-[15%] left-[21%] rotate-[5deg] z-30" />

            <LightGarland numberBulbs={6} decale={true} className="w-[6%] bottom-[13%] lg:bottom-[15%] left-[31%] rotate-[30deg] z-30" />
            <LightGarland numberBulbs={6} className="w-[9%] bottom-[6%] left-[30%] rotate-[5deg] z-30" />
            
            <LightGarland numberBulbs={6} className="w-[11%] bottom-[56%] -right-[5%] rotate-[5deg] z-30" />
            <LightGarland numberBulbs={6} decale={true} className="w-[14%] bottom-[38%] -right-[7%] rotate-[25deg] z-30" />
            <LightGarland numberBulbs={7} className="w-[16%] lg:w-[18%] bottom-[30%] -right-[9%] rotate-[350deg] z-30" />
            
            <LightGarland numberBulbs={6} className="w-[9%] lg:w-[9%] bottom-[23%] lg:bottom-[25%] right-[16%] lg:right-[16%] rotate-[10deg] z-30" />
            <LightGarland numberBulbs={7} decale={true} className="w-[9%] bottom-[15%] right-[16%] rotate-[350deg] z-30" />
            
            </div>

        </div>
    );
}


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
        <div className="absolute w-full h-full pointer-events-none overflow-hidden">
        {/* Montagnes à l'arrière-plan */}
            <img
                src={dunegauche}
                alt=""
                className="absolute h-[400px] w-[700px] top-[120px] left-0"
            />

            <img
                src={dunedroite}
                alt=""
                className="absolute h-[400px] w-[700px] top-[120px] right-0"
            />

            <img
                src={dune3}
                alt=""
                className="absolute h-[400px] w-[520px] top-[100px] right-0"
            />

            <img
                src={dune4}
                alt=""
            className="absolute h-[300px] w-[450px] top-[200px] -left-10"
            />

            <img
                src={nuage}
                alt=""
                className="absolute h-[100px] w-[200px] top-[80px] left-[65%] -translate-x-1/2"
            />
{/* 
            <img
                src={subtract}
                alt=""
                className="absolute h-[70px] w-[700px] bottom-[20%] left-1/2 -translate-x-1/2 z-20"
            /> */}

            <img
                src={secondplan}
                alt=""
                className="absolute h-[72%] w-full bottom-0 left-1/2 -translate-x-1/2 z-20"
            />
            
            <div className="absolute bottom-0 inset-x-0 aspect-[1440/370]">
            <img
                src={firstplan}
                alt=""
                className="absolute h-[98%] w-full bottom-0 left-1/2 -translate-x-1/2 z-20"
            />
            {/* First fir */}
            <LightGarland width={11} numberBulbs={6} decale={false} className="bottom-[70%] left-0 rotate-[5deg] z-30" />
            <LightGarland width={13} numberBulbs={6} decale={true} className="bottom-[62%] left-0 rotate-[340deg] z-30" />
            <LightGarland width={14} numberBulbs={6} className="bottom-[35%] left-0 rotate-[5deg] z-30" />

            <LightGarland width={9} numberBulbs={6} decale={true} className="bottom-[50%] left-[14%] rotate-[345deg] z-30" />
            <LightGarland width={9} numberBulbs={6} className="bottom-[30%] left-[14%] rotate-[5deg] z-30" />

            <LightGarland width={6} numberBulbs={6} className="bottom-[27%] left-[21%] rotate-[335deg] z-30" />
            <LightGarland width={9} numberBulbs={6} decale={true} className="bottom-[15%] left-[21%] rotate-[5deg] z-30" />

            <LightGarland width={6} numberBulbs={6} decale={true} className="bottom-[15%] left-[31%] rotate-[30deg] z-30" />
            <LightGarland width={9} numberBulbs={6} className="bottom-[6%] left-[30%] rotate-[5deg] z-30" />
            
            <LightGarland width={11} numberBulbs={6} className="bottom-[55%] -right-[5%] rotate-[5deg] z-30" />
            <LightGarland width={15} numberBulbs={6} decale={true} className="bottom-[40%] -right-[7%] rotate-[25deg] z-30" />
            <LightGarland width={20} numberBulbs={7} className="bottom-[30%] -right-[9%] rotate-[350deg] z-30" />
            
            <LightGarland width={8} numberBulbs={6} className="bottom-[25%] right-[17%] rotate-[10deg] z-30" />
            <LightGarland width={9} numberBulbs={7} decale={true} className="bottom-[15%] right-[16%] rotate-[350deg] z-30" />
            
            </div>

        </div>
    );
}

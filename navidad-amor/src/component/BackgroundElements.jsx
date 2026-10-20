
import dunegauche from '../assets/3plan/Dune gauche.png';
import dunedroite from '../assets/3plan/Dune droite.png';
import dune3 from '../assets/3plan/Dune 3.png';
import dune4 from '../assets/3plan/Dune 4.png';
import nuage from '../assets/3plan/Nuage.png';
import subtract from '../assets/2plan/Subtract.png';
import firstplan from '../assets/1plan/1er plan.png';
import secondplan from '../assets/2plan/2e plan.png';

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
                className="absolute h-[370px] w-full bottom-0 left-1/2 -translate-x-1/2 z-20"
            />
            
            <img
                src={firstplan}
                alt=""
                className="absolute h-[350px] w-full bottom-0 left-1/2 -translate-x-1/2 z-20"
            />

        </div>
    );
}

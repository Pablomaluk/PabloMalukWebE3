import pablo from "./pablo.jpeg"



function AboutPablo() {
    return (
    <div className='about-profile'>
        <h2>Pablo Maluk</h2>
        <img src={pablo} />            
        <h3> Hola mundo, soy Pablo. Me gusta el dinero y estoy en 5to año de ingeniería de software. Con Emilio
             estamos haciendo un juego genial para ustedes. Paguenos porfavor
        </h3>
    </div>
    )
}


export default function About() {
    return (
    <>
    <AboutPablo />
    </>
    )
}
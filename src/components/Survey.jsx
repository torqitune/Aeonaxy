import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Survey = () => {
    const { userId } = useParams();
    const navigateTo = useNavigate();           //creating an instance

    // cardsData is an array of objects, each object has info about each card
    const cardsData = [
        { id: 1, title: "I'm a designer looking to share my work", image: '/CoffeeDoddle.png', description: 'With over 7 million shots from a vast community of designers, Dribble is the leading source for design inspiration.' },
        { id: 2, title: "I'm looking to hire a designer", image: '/DoogieDoodle.png', description: 'With over 7 million shots from a vast community of designers, Dribble is the leading source for design inspiration.' },
        { id: 3, title: "I'm looking for design inspiration", image: '/MessyDoodle.png', description: 'With over 7 million shots from a vast community of designers, Dribble is the leading source for design inspiration.' }
    ];

    // State to keep values of the selected cards
    const [selectedCards, setSelectedCards] = useState([]); // initially array is set to empty, meaning no card is selected

    //creating a useEffect
    useEffect(()=>{
        console.log(selectedCards);
    },[selectedCards]);     //this effect will run whenever selectedCards changes


    // Function to select/de-select a card
    const toggleCardSelection = (cardId) => { // when any card is clicked this function is called, the id of card is passed as an argument
        setSelectedCards(prevSelectedCards => {
            if (prevSelectedCards.includes(cardId)) { // if the card with id exists in the selected array, that means the card is already selected and we need to unselect that card
                return prevSelectedCards.filter(id => id !== cardId); // using filter method to remove the current cardId
            } else {
                return [...prevSelectedCards, cardId]; // else the card was not and now we need to select it, so update the selectedCards array with the id of the current card
            }
        });
    };

    //when user finish submit button , redirect to emailPage along with userID and send selectedCards
    const handleSubmitPage = async(e) => {
        e.preventDefault(); //this is used to prevent default behavior of an event from occurring, When an event is triggered (e.g., form submission, link click, button click), the browser executes a default action associated with that event. For example, when a form is submitted, the browser typically sends a request to the server and reloads the page.
        // In some cases, we  want to prevent this default behavior from happening , we want to validate form data with JavaScript before submitting the form to the server. so prevent it before submitting to server.   

        try{
            const response = await axios.post("https://aeonaxy-6-jzkv.onrender.com/email",{userId , selectedCards});   //sending selectedCards which is an array in post request
            console.log("survey page send a post request");
            navigateTo(`/email/${userId}`);     //redirecting to email page , while passing uderID (mongoDB unique id).

        }catch(err){
            console.log("SurveyPage error while sending post request",err);
        }

    }

    return (
        <div>
            <nav className="p-7">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <img src="/dribbble1.jpg" alt="Logo" className="h-12 w-20 ml-6" />
                    </div>
                </div>
            </nav>

            <h1 className="text-2xl font-bold mb-4 text-center">What brings you to Dribbble?</h1>
            <p className="mb-8 text-center">Select the options that best describe you. Don't worry, you can explore other options later.</p>

            <div className="container mx-auto mt-10 mb-8 flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* here using map method, which is used to iterate over each object present in cardsData array, here card is the iterator */}
                    {cardsData.map(card => (
                        // if any card is selected then an id is assigned to the div as key, for uniqueness, so if key exists then using if-else condition to set the classname
                        <div key={card.id} className={`p-4 border rounded-lg ${selectedCards.includes(card.id) ? 'border-pink-600 sm:w-64' : 'sm:w-64'}`} onClick={() => toggleCardSelection(card.id)}>
                            <img src={card.image} alt={card.title} className="w-full h-40 object-cover rounded-lg mb-2" />
                            <h2 className="text-lg font-bold mb-2 text-center">{card.title}</h2>
                            {selectedCards.includes(card.id) && <p className='text-center'>{card.description}</p>}
                        </div>
                    ))}
                </div>
            </div>
                
            <p className="text-sm font-bold mb-6 text-center">Anything else? You can select multiple</p>        

            
            <div className="flex justify-center mt-4">
                <button type="submit" className="bg-pink-600 text-white font-bold py-2 px-4 rounded w-60" onClick={handleSubmitPage}>
                    Finish
                </button>
            </div>
            <a href={`/profile/${userId}`} className='text-center item-center text-sm mb-6 block'>or PRESS RETURN</a>


        </div>
    );
};

export default Survey;

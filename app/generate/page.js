'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs'; // Make sure this hook is client-side compatible
import { getDoc } from 'firebase/firestore';

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            const response = await fetch('api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text }) // Ensure the payload is sent as JSON
            });
            const data = await response.json();
            setFlashcards(data);
        } catch (error) {
            console.error('Failed to generate flashcards:', error);
        }
    };

    const handleCardClick = id => {
        setFlipped(prev => ({
            ...prev,
            [id]: !prev[id]  // Correct toggling logic for flipped state
        }));
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const saveFlashcards = async () => {
        if (!name) {
            alert("Please enter a name")
            return
        }

        const batch = writeBtach(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if(docSnap.exists()){
            const collections = docSnap.data().flashcards || []
            if (collections.find((f)=> f.name === name)) {
                alert("Flashcard collection with the same name already exists")
                return
            }
            else {
                collections.push([name])
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        }
        else{
            batch.set(userDocRef, {flashcards: [{name}]})
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard)=>{
            const cardDocREf = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('flashcards')

    }

    
}

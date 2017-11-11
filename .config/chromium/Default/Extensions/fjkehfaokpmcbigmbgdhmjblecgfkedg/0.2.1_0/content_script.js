walk(document.body);

function walk(node) 
{
	// I stole this function from here:
	// http://is.gd/mwZp7E
	
	var child, next;

	switch ( node.nodeType )  
	{
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while ( child ) 
			{
				next = child.nextSibling;
				walk(child);
				child = next;
			}
			break;

		case 3: // Text node
			handleText(node);
			break;
	}
}

function handleText(textNode) 
{
	var myArray = ['Donald "I don\'t want to use the word \'screwed\', but I screwed him" Trump', 
				'Donald "Why doesn\'t he show his birth certificate" Trump', 
				'Donald "I\'m starting to wonder myself whether he was born in this country" Trump', 
				'Donald "Maybe it says he\'s a Muslim" Trump', 
				'Donald "The U.S. has become a dumping ground" Trump', 
				'Donald "Some, I assume, are good people" Trump', 
				'Donald "It was a great night for Mexico" Trump', 
				'Donald "I have a great relationship with the blacks" Trump', 
				'Donald "Laziness is a trait in blacks" Trump', 
				'Donald "All of the women on The Apprentice flirted with me" Trump', 
				'Donald "She talks like a truck driver" Trump', 
				'Donald "We need global warming" Trump', 
				'Donald "To the victor belong the spoils" Trump', 
				'Donald "Stay and we keep the oil" Trump', 
				'Donald "My I.Q. is one of the highest" Trump', 
				'Donald "Please don\'t feel so stupid or insecure" Trump', 
				'Donald "People are praying for me" Trump', 
				'Donald "Spread it out in small doses" Trump', 
				'Donald "I\'m the best 140 character writer in the world" Trump', 
				'Donald "My twitter has become so powerful" Trump', 
				'Donald "I am the only person who immediately walked out of my \'Ali G\' interview" Trump', 
				'Donald "The concept of global warming was created by and for the Chinese" Trump', 
				'Donald "Why is Obama playing basketball today" Trump', 
				'Donald "@BetteMidler is an extremely unattractive woman" Trump', 
				'Donald "I promise not to talk about your massive plastic surgeries" Trump', 
				'Donald "You won\'t see another black president for generations" Trump',
				'Donald "I am the least racist person" Trump',
				'Donald "The line of \'Make America great again,\' the phrase, that was mine" Trump',
				'Donald "Because I don\'t want to, Greta" Trump',
				'Donald "Did you notice that baby was crying through half of the speech and I didn’t get angry?" Trump',
				'Donald "That baby was driving me crazy" Trump',
				'Donald "My net worth is many, many, many times Mitt Romney" Trump', 
				'Donald "Our planet is freezing" Trump', 
				'Donald "I\'m more honest and my women are more beautiful" Trump', 
				'Donald "A lot of people are switching to these really long putters, very unattractive" Trump', 
				'Donald "Somebody\'s doing the raping" Trump', 
				'Donald "I have so many websites" Trump', 
				'Donald "I will be the greatest jobs president that God ever created" Trump', 
				'Donald "We have stupid people" Trump', 
				'Donald "I beat China all the time" Trump', 
				'Donald "When did we beat Japan at anything?" Trump', 
				'Donald "When was the last time you saw a Chevrolet in Tokyo?" Trump', 
				'Donald "I think I am a nice person" Trump', 
				'Donald "Nobody builds walls better than me" Trump', 
				'Donald "I promise I will never be in a bicycle race" Trump', 
				'Donald "The American dream is dead" Trump']; 
	var rand = myArray[Math.floor(Math.random() * myArray.length)];
	var v = textNode.nodeValue;

	v = v.replace(/\bDonald\b/g, "");
	v = v.replace(/\bTrump\b/g, rand);
	v = v.replace(/\bThe 's\b/gi, rand + "'s");
			
	textNode.nodeValue = v;
}
import {useEffect, useState} from 'react';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import TextInput from 'ink-text-input';
import {Text,Newline} from 'ink';
import Link from 'ink-link';
import clipboard from "clipboardy";
import * as fs from "fs";

type Props = {};


export default function App({}: Props) {
	const [key, setKey] = useState<string>("")
	const [email, setEmail] = useState<string>("")
	const [stepsMode,setStepsMode] = useState<boolean>(false)
	const [skip,setSkip] = useState<boolean>(false)
	const [didSaveToken,setDidSaveToken] = useState<boolean>(false)
	const [isSuccess,setIsSuccess] = useState<boolean>(false)
	const [isFail,setIsFail] = useState<boolean>(false)




	useEffect(() => {
		fs.readFile('./DDG_TOKEN.txt', 'utf8', (err, data) => {
			if (err) {
				return;
			}
			setKey(data)
			setSkip(true)
			void fetchEmail(true,data)
		});
	},[])


	async function fetchEmail(skipKeyCheck?:boolean,keyBypass?:string) {
		if(key === "" && !skipKeyCheck){
			setStepsMode(true)
			return
		}

		const data = await fetch('https://quack.duckduckgo.com/api/email/addresses', {
			method: 'POST',
			headers: {
				'Authorization':keyBypass ? keyBypass : key,
			},
		})
		const res = await data.json();
		const address = res.address
		if(address){
			setEmail(`${address}@duck.com`)
			clipboard.writeSync(`${address}@duck.com`);
			setIsSuccess(true)
		}
		else{
			setIsFail(true)
		}


		if(data && key){
			fs.writeFile("./DDG_TOKEN.txt", key, (err) => {
				if (err)
					return
				else {
					setDidSaveToken(true)
				}})
		}

	}

	return (
		<>
			{!stepsMode ?
				<>
					<Gradient colors={['#5f00ff', '#fb0606']}>
						<BigText text="DDG-Now" font={"simple3d"} align='center'/>
					</Gradient>

					{!skip &&
						<>
							<Text color={"#9b0303"}>Please enter your Bearer Token. Leave blank and press <Text color={"#53caf5"}>ENTER</Text> if you do not know how to get your token.</Text>
							<TextInput value={key} onChange={setKey} onSubmit={() => fetchEmail(false)}/>
						</>
					}

					{didSaveToken &&
						<>
							<Newline/>
							<Text color={"#5fff00"}>Your token has been saved in the current directory, such that next time you run ddg-now from this directory, you will not need to enter it.</Text>
							<Newline/>
						</>
					}

					{isSuccess && <Text color={"#5fff00"}>An email, {email} has been copied to your clipboard</Text>}

					{isFail && <Text color={"#9b0303"}>Fatal Error Occurred when fetching email. Please ensure key is correct.</Text>}


				</>
				:
				<>
					<Newline/>
					<Link url="https://duckduckgo.com/email/settings/autofill">
						<Text color={"#1fbbb5"}>Step 1) Visit the DDG email site</Text>
					</Link>

					<Newline/>
					<Text color={"#1fbbb5"}>Step 2) Open Developer tools (Ctrl + Shift + I on Chrome)</Text>
					<Newline/>
					<Text color={"#1fbbb5"}>Step 3) Go to the "Network" Tab</Text>
					<Newline/>
					<Text color={"#1fbbb5"}>Step 4) Press "Generate Duck Address"</Text>
					<Newline/>
					<Text color={"#1fbbb5"}>Step 5) Two entries should appear in Developer tools. Click the one with method "POST"</Text>
					<Newline/>
					<Text color={"#1fbbb5"}>Step 6) Scroll down to "Request Headers", and copy the "Authorisation" part.</Text>
					<Newline/>
					<Text color={"#1fbbb5"}>Step 7) Ensure your token you copied starts with "Bearer", followed by a long string of characters.</Text>
					<Newline/>
					<Text color={"#3eff00"}>Step 8) Now that your key is copied, press <Text color={"#53caf5"}>ANY KEY</Text> to return.</Text>
					<Newline/>

					<TextInput value={key} onChange={() => setStepsMode(false)} onSubmit={() => setStepsMode(false)}/>
				</>
			}

		</>
	);
}

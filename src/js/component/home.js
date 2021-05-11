import React, { Fragment, useEffect, useState, useRef } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
export function Home() {
	const BASE_URL = "https://assets.breatheco.de/apis/sound/";
	const audioTag = useRef(); // variable que utilizo para sustituir el document.querySelector (4º)

	const [songs, setSongs] = useState([]); // variable que tengo que declarar para las canciones (1º)
	const [paintedSongs, setPaintedSongs] = useState(); // variable que declaro dibujar el map (2º)
	const [songAudio, setSongAudio] = useState(""); // variable que declaro para poner la url del audio en el onclick (3º)
	const [pause, setPause] = useState(false); // variable para la función de pausar (5º)
	const [actualSong, setActualSong] = useState("");
	const [playPause, setPlayPause] = useState(false);
	const [faPlay, setFaPlay] = useState("fa-pause");

	//1º.- Se utiliza para cargar la lista
	useEffect(() => {
		fetch(BASE_URL.concat("songs"))
			.then(response => {
				if (!response.ok) {
					throw Error(response.statusText);
				}
				return response.json();
			})
			.then(responseAsJson => {
				setSongs(responseAsJson); //Aquí están las url de las 22 reproducciones.
			})
			.catch(function(error) {
				console.log("Looks like there was a problem: \n", error);
			});
	}, []);

	//2º Se utiliza para controlar las modificadiones de "songs". La {song.name} y la {song.url} está en la consola.
	useEffect(() => {
		setPaintedSongs(
			songs.map((song, index) => {
				return (
					<li
						id={index}
						key={index.toString()}
						onClick={() => {
							setSongAudio(song.url);
							setPause(pause);
							setActualSong(index);
						}}>
						{song.name}
					</li>
				);
			})
		);
	}, [songs]);

	// 3º Se utiliza para el useRef
	const updateSong = () => {
		if (pause == false) {
			audioTag.current.pause();
			setPause(true);
		} else {
			audioTag.current.play();
			setPause(false);
		}
	};

	// 4º Se utiliza para el useRef
	const nextSong = actual => {
		let initialSong = 0;
		if (actual == 21) {
			setSongAudio(songs[0].url);
			setActualSong(initialSong);
			setPause(false);
		} else {
			setFaPlay("fa-pause");
			setSongAudio(songs[actual + 1].url);
			setActualSong(actual + 1);
			setPause(false);
		}
	};

	const previousSong = actual => {
		let finalSong = 21;
		if (actual == 0) {
			setSongAudio(songs[21].url);
			setActualSong(finalSong);
			setPause(false);
		} else {
			setFaPlay("fa-pause");
			setSongAudio(songs[actual - 1].url);
			setActualSong(actual - 1);
			setPause(false);
		}
	};

	useEffect(() => {
		if (playPause) {
			setFaPlay("fa-play");
		} else {
			setFaPlay("fa-pause");
		}
	}, [playPause]);

	// {paintedSongs} lo tengo el map para dibujar la list
	return (
		<>
			<audio
				controls
				autoPlay
				key={actualSong}
				src={BASE_URL + songAudio}
				ref={audioTag}
				className="d-none"
			/>
			<ul>{paintedSongs}</ul>
			<Container>
				<Card className="mx-auto mt-5">
					<Card.Body>
						<Card.Title>
							<Row className="row-player">
								<Col>
									<Button
										onClick={() => {
											previousSong(actualSong);
										}}
										variant="default"
										className="uvs-left">
										<i className="fa fa-backward ml-4" />
									</Button>
								</Col>
								<Col>
									{" "}
									<Button
										onClick={() => {
											updateSong();
											setPlayPause(!pause);
										}}
										variant="default"
										className="uvs-left d-flex flex-row">
										<i className={"fa ml-3" + faPlay} />
									</Button>
								</Col>
								<Col>
									<Button
										onClick={() => {
											nextSong(actualSong);
										}}
										variant="default"
										className="uvs-left">
										<i className="fa fa-forward ml-3" />
									</Button>
								</Col>
							</Row>
						</Card.Title>
					</Card.Body>
					<progress max="100" value="100" />
				</Card>
			</Container>{" "}
		</>
	);
}

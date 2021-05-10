import React, { Fragment, useEffect, useState, useRef } from "react";
export function Home() {
	const BASE_URL = "https://assets.breatheco.de/apis/sound/";
	const audioTag = useRef(); // variable que utilizo para sustituir el document.querySelector (4º)

	const [songs, setSongs] = useState([]); // variable que tengo que declarar para las canciones (1º)
	const [paintedSongs, setPaintedSongs] = useState(); // variable que declaro dibujar el map (2º)
	const [songAudio, setSongAudio] = useState(""); // variable que declaro para poner la url del audio en el onclick (3º)
	const [pause, setPause] = useState(false); // variable para la función de pausar (5º)

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
							console.log(pause);
							setPause(!pause);
						}}>
						{song.name}
					</li>
				);
			})
		);
	}, [songs]);

	// 3º Se utiliza para el useRef
	useEffect(() => {
		if (pause == false) {
			audioTag.current.pause();
		} else {
			audioTag.current.play();
		}
	}, [pause]);

	// const playAndPauseSong = () => {
	// 	if (pause == false) {
	// 		audioTag.current.pause();
	// 	} else {
	// 		audioTag.current.play();
	// 		setPlay(true);
	// 	}
	// };

	// 4º Se utiliza para el useRef
	const nextSong = () => {};

	const previousSong = () => {};

	// {paintedSongs} lo tengo el map para dibujar la list
	return (
		<>
			<audio autoPlay ref={audioTag} src={BASE_URL.concat(songAudio)} />
			<ul>{paintedSongs}</ul>
		</>
	);
}

<script lang="ts">
	import { T, useFrame } from '@threlte/core';
	import { Grid, Text, Instance, InstancedMesh } from '@threlte/extras';
	import { MeshLineMaterial, MeshLineGeometry, OrbitControls, useTexture } from '@threlte/extras';
	import { Vector3, CatmullRomCurve3, Color } from 'three';

	import colors from '$lib/styles/colors.json';

	let scrollY = 0;

	let rotation = 0;
	let dn = Date.now();

	// create a smooth curve from 4 points
	const curve = new CatmullRomCurve3([
		new Vector3(-10, -5, -5),
		new Vector3(-5, -3, -3),
		new Vector3(5, -3, 3),
		new Vector3(10, -5, -5)
	]);

	// convert curve to an array of 100 points
	const points = curve.getPoints(100);

	let width = 0.0075;
	let dashOffset = 0;
	let color = new Color();

	useFrame((state, delta) => {
		// every frame we:
		// increase the dash offset
		dashOffset += delta / 2;

		// rotation += 0.002;
		dn = Date.now();
	});
</script>

<svelte:window bind:scrollY />

<T.Mesh position.y={0} position.z={0} position.x={0} scale={1}>
	<MeshLineGeometry {points} />
	<MeshLineMaterial
		{width}
		color={new Color(colors.primary)}
		dashArray={0.5}
		dashRatio={0.5}
		{dashOffset}
		transparent
		depthTest={false}
	/>
</T.Mesh>

<T.Group rotation.y={rotation}>
	<T.OrthographicCamera
		zoom={80}
		position={[0, 5, 10]}
		makeDefault
		on:create={({ ref }) => {
			ref.lookAt(0, 0, 0);
		}}
	/>
</T.Group>
<!-- 
<T.Group>
	<Text
		text="Sawyer Click"
		characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		color={colors.dark}
		fontSize={2}
		anchorX="50%"
		anchorY="50%"
		font="./fonts/grandmasterclash.otf"
		position={[0, 0, 0]}
	/>

	<T.Mesh position.y={0} position.z={0} position.x={0} scale={1}>
		<MeshLineGeometry {points} />
		<MeshLineMaterial
			{width}
			{color}
			dashArray={0.5}
			dashRatio={0.5}
			{dashOffset}
			transparent
			depthTest={false}
		/>
	</T.Mesh>

	<Text
		text="SR. DATA VIZ DEVELOPER AT THE DATAFACE"
		characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		color={colors.dark}
		fontSize={0.3}
		anchorX="100%"
		anchorY="50%"
		font="./fonts/esteban-latin-400-normal.woff"
		position={[6.7, -0.75, 0]}
	/>
</T.Group> -->

<Grid sectionColor={colors.dark} />

import { createCanvas, loadImage } from 'canvas';

export const roundImage = async ( image, weight ) => {
	const canvasPhoto = createCanvas( weight, weight );
	const ctx = canvasPhoto.getContext( '2d' );

	ctx.beginPath();
	ctx.arc( weight / 2, weight / 2, weight / 2, 0, Math.PI * 2, true );
	ctx.closePath();
	ctx.clip();

	const photo = await loadImage( image ).catch( () => {} );
	ctx.drawImage( photo, 0, 0, weight, weight );

	return canvasPhoto;
};

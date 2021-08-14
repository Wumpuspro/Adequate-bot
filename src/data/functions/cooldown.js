const cooldownMap = new Set();

export const cooldown = ( user, command, seg ) => {
	const name = `${ user.id }-${ command }`;
	if ( seg === 0 ) return true;
	if ( cooldownMap.has( name ) ) return false;

	cooldownMap.add( name );
	setTimeout( () => {
		cooldownMap.delete( name );
	}, seg * 1000 );

	return true;
};

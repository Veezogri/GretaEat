async function AfficherPlatauHasard() {
    const reponse = await fetch('www.themealdb.com/api/json/v1/1/random.php');
    const RandomPlat = await reponse.json();
    console.log(RandomPlat);
    
}
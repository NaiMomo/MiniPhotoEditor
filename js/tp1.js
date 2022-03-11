/* Ce code sert d’un mini-logiciel d’eﬀets sur des images.
Il s'agit de 4 fonctions pricipiales qui changent l'image orginale,
pour des effets de noir et blanc, de clarté, de flou et de détection de 
contours.
*/
 
//fonction vus durant le cours magistraux pour creer une matrice de certaines lignes et certaines colonnes. 
function creerMatrice(nbRangees, nbColonnes) {
    var resultat = Array(nbRangees);

    for (var i = 0; i < nbRangees; i++) {
        resultat[i] = Array(nbColonnes);
    }
    return resultat;
}
 
/* Cette fonction prend un image en paramètre et retourne une nouvelle image 
avec l'effet noir et blanc. Donc on appliquerai la luminance sur chaque pixel de 
l'image originale. Commence par appel a la fonction creerMatrice pour creer une 
nouvelle matrice (imgNb) tiré de l'originle, qui sera modifié pour l'effet noir et blanc.
*/
function noirEtBlanc(imageOriginale) {
	var imgNb = creerMatrice(imageOriginale.length, imageOriginale[0].length); 
    for (var x = 0; x < imageOriginale.length; x++) {			//Loop pour passer dans chaque ligne (x).
		for (var y = 0; y < imageOriginale[x].length; y++) {	//Loop pour passer dans chaque colonne (y).
            imgNb[x][y] = {r: 0,g: 0,b: 0};		//les pixels default de imgNb sont assigné (r,g,b) a 0.
			
//Variable pour eviter les repetitions et pour respecter 80 caracteres par ligne.
// luminance(r,v,b)=0.2126r +0.7152v +0.0722b
			var rOriginale = imageOriginale[x][y].r;	
			var gOriginale = imageOriginale[x][y].g;
			var bOriginale = imageOriginale[x][y].b;
			var luminance = rOriginale * 0.2126 + gOriginale * 0.7152 + bOriginale * 0.0722;

//Appliquer luminance sur chaque pixel de imgNb.            
			imgNb[x][y].r = luminance;
            imgNb[x][y].g = luminance;
            imgNb[x][y].b = luminance;
        }
    }
    return imgNb; // Renvoie l'image originale modifié en noirEtBlanc.
}

/* Cette fonction prend deux parametere pour transformer une image avec l'effet augmenter/diminuer la clarté.
Premier paramètre s'agit d'une image et le deuxieme est un nombre(quantité) >1 ou <1. si nombre > 1 
aumentera la clarté et nombre < 1 diminuera la clarté. Commence par appel a la fonction creerMatrice 
pour creer une nouvelle matrice (imgClar) tiré de l'originle, qui sera modifié pour l'effet clarté.
*/
function correctionClarte(imageOriginale, quantite) {
    var imgClar = creerMatrice(imageOriginale.length, imageOriginale[0].length);
    for (var x = 0; x < imageOriginale.length; x++) {		 //Loop pour passer dans chaque ligne (x).
        for (var y = 0; y < imageOriginale[x].length; y++) { //Loop pour passer dans chaque colonne(y).
            imgClar[x][y] = {r: 0,g: 0,b: 0};		//les pixels default de imgClar sont assigné (r,g,b) a 0.

//Appliquer la clarté ( si quantité >1 aumentera clarté et si quantité < l’assombrira) sur chaque pixel de imgClar.          
			imgClar[x][y].r = Math.pow((imageOriginale[x][y].r) / 255, quantite) * 255;
            imgClar[x][y].g = Math.pow((imageOriginale[x][y].g) / 255, quantite) * 255;
            imgClar[x][y].b = Math.pow((imageOriginale[x][y].b) / 255, quantite) * 255;
        }
    }
    return imgClar; // Renvoie l'image originale modifié en effet clarté.
}

/* Cette fonction est un calcul de la moyenne pondérée d'un piexel
afin d'éviter la répétition du code dans la fonction flou. 
Il y a deux appels de cette fonction dans cette dernière, 
un pour N pair et un autre pour N impair. Vu de sa nature, 
tests unitaires sur la fonction flou sont suffisante pour
cette fonction. 
rangeeC et colonneC indiquent la position du pixel au centre de voisinage.
la combinaison de deplacement 1 et 2 couvre l'intervalle de voisinage.
*/
function moyennePonderee (imageOriginale, pixelC, rangeeC, colonneC, deplacement1, deplacement2, voisinage) { 
    for (var k = rangeeC-deplacement1; k < rangeeC+deplacement2; k++) {
		for (var l = colonneC-deplacement1; l < colonneC+deplacement2; l++) {
			if (k >= 0 && k < imageOriginale.length && l >= 0 && l < imageOriginale[0].length) {//bordure de l'image
				pixelC.r += imageOriginale[k][l].r/Math.pow(voisinage,2);//accumuler la valeur
				pixelC.g += imageOriginale[k][l].g/Math.pow(voisinage,2);
				pixelC.b += imageOriginale[k][l].b/Math.pow(voisinage,2);
			}
		}
	}
}
	
//Sert à transformer l'image originale à l'image floue d'une certaine taille	
function flou(imageOriginale, taille) { 
	var imgResultat = creerMatrice(imageOriginale.length,imageOriginale[0].length);
	for (var i = 0; i < imageOriginale.length; i++) {
		for (var j = 0; j < imageOriginale[i].length; j++) {
			imgResultat[i][j] = {r: 0, g: 0, b: 0};//À accumuler les valeurs pour la moyenne
			if (taille % 2 == 0) {//N pair
				moyennePonderee (imageOriginale, imgResultat[i][j], i, j, taille/2, taille/2, taille);
			}
			else {//N impair
				moyennePonderee (imageOriginale, imgResultat[i][j], i, j, Math.floor(taille/2), Math.floor(taille/2)+1, taille);
			}
		}
	}
	if (taille == 0) { // cas spécial, car diviser par 0 donne infinité
		imgResultat = imageOriginale;
	}
    return imgResultat; // Remplacer par la nouvelle image
}

/*Calcul qui donne la valeur absolue de la variationX d'un pixel.
Canal r est choisi  vu que r = g = b dans l'image "noir et blanc".
Cette fonction est une décomposition fonctionnelle de la fonction
"detectionContours", donc tests unitaires pour "detectionContours"
sont suffisantes pour celle-ci.
*/
function VariationXAbs (imageOriginale, pixelC, rangeeC, colonneC) {
	for (var k = rangeeC-1; k <= rangeeC+1; k++) {
		for (var l = colonneC-1; l <= colonneC+1; l++) {
			if (k >= 0 && k < imageOriginale.length && l >= 0 && l < imageOriginale[0].length) {//bordure de l'image
				if (k == rangeeC-1 && l == colonneC-1 || k == rangeeC+1 && l == colonneC-1){
					pixelC.r -= imageOriginale[k][l].r;//accumuler la valeur
				}
				if (k == rangeeC && l == colonneC-1){
					pixelC.r -= 2*imageOriginale[k][l].r;//accumuler la valeur
				}
				if (k == rangeeC-1 && l == colonneC+1 || k == rangeeC+1 && l == colonneC+1){
					pixelC.r += imageOriginale[k][l].r;//accumuler la valeur
				}
				if (k == rangeeC && l == colonneC+1){
					pixelC.r += 2*imageOriginale[k][l].r;//accumuler la valeur
				}
			}
		}
	}
	pixelC.r = Math.abs(pixelC.r);
}

/*Calcul qui donne la valeur absolue de la variationY d'un pixel.
Canal r est choisi  vu que r = g = b dans l'image "noir et blanc".
Cette fonction est une décomposition fonctionnelle de la fonction
"detectionContours", donc tests unitaires pour "detectionContours"
sont suffisantes pour celle-ci.
*/
function VariationYAbs (imageOriginale, pixelC, rangeeC, colonneC) {
	for (var k = rangeeC-1; k <= rangeeC+1; k++) {
		for (var l = colonneC-1; l <= colonneC+1; l++) {
			if (k >= 0 && k < imageOriginale.length && l >= 0 && l < imageOriginale[0].length) {//bordure de l'image
				if (k == rangeeC-1 && l == colonneC-1 || k == rangeeC-1 && l == colonneC+1){
					pixelC.r -= imageOriginale[k][l].r;//accumuler la valeur
				}
				if (k == rangeeC-1 && l == colonneC){
					pixelC.r -= 2*imageOriginale[k][l].r;//accumuler la valeur
				}
				if (k == rangeeC+1 && l == colonneC-1 || k == rangeeC+1 && l == colonneC+1){
					pixelC.r += imageOriginale[k][l].r;//accumuler la valeur
				}
				if (k == rangeeC+1 && l == colonneC){
					pixelC.r += 2*imageOriginale[k][l].r;//accumuler la valeur
				}
			}
		}
	}
	pixelC.r = Math.abs(pixelC.r);
}

//Fonction sert à détecter les contours à l'intérieur d'une image
function detectionContours(imageOriginale) {
    imageOriginale = noirEtBlanc(imageOriginale);
	var imgResultat = creerMatrice(imageOriginale.length,imageOriginale[0].length);
	var matVariationX = creerMatrice(imageOriginale.length,imageOriginale[0].length);
	var matVariationY = creerMatrice(imageOriginale.length,imageOriginale[0].length);
	for (var i = 0; i < imageOriginale.length; i++) {
		for (var j = 0; j < imageOriginale[i].length; j++) {
			imgResultat[i][j] = {r: 0, g: 0, b: 0};//À accumuler les valeurs
			matVariationX[i][j] = {r: 0, g: 0, b: 0};
			matVariationY[i][j] = {r: 0, g: 0, b: 0};
			VariationXAbs (imageOriginale, matVariationX[i][j], i, j);
			VariationYAbs (imageOriginale, matVariationY[i][j], i, j); 
			imgResultat[i][j].r += Math.max (matVariationX[i][j].r,matVariationY[i][j].r);
			if (imgResultat[i][j].r > 255){//limite de valeur du canal = 255
				imgResultat[i][j].r = 255;
			}
			imgResultat[i][j].g = imgResultat[i][j].r;
			imgResultat[i][j].b = imgResultat[i][j].r;
		}
	}
	return imgResultat; // Remplacer par la nouvelle image
}

//Pour faire un arrondissement au 14ème chiffres décimales d'un nombre.
function arrondir (nb){
	nb = nb - nb%Math.pow(10,-14);
	return nb;
}

/* Fonction qui sert à comparer spécifiquement deux images pour faire 
des tests unitaires vu qu'on n'a encore pas appris JSON.stringify()
*/
function comparerDeuxImages (image1, image2) {
	if (image1.length != image2.length || image1[0].length != image2[0].length){
		return false;//False si tailles différentes
	}
	for (var i = 0; i < image1.length; i++) {
		for (var j = 0; j < image1[i].length; j++) {
			/*Vu que JS utilise points flottants et qu'on travaille avec les fractions
			(ex. 1/(N*N)), un arrondissement est nécessaire pour comparer. Par exemple,
			(1/9+1/9+1/9+1/9+1/9+1/9) n'égale pas à 6/9 dans JS.
			*/
			var r = arrondir(image1[i][j].r) != arrondir(image2[i][j].r)//vérifier canal r des deux pixels
			var g = arrondir(image1[i][j].g) != arrondir(image2[i][j].g)
			var b = arrondir(image1[i][j].b) != arrondir(image2[i][j].b)
			if ( r || g || b ){
				return false;//false si valeurs différentes
			}
		}
	}	
	return true;//True si les deux images sont identiques
}


function tests() {
	
	//images utilisées dans les tests
	var img1 = [[{r:1,g:1,b:1},{r:1,g:1,b:1}],
	            [{r:1,g:1,b:1},{r:1,g:1,b:1}]];
				
	var img2 = [[{r:1/4,g:1/4,b:1/4},{r:1/2,g:1/2,b:1/2}],
	            [{r:1/2,g:1/2,b:1/2},{r:1,g:1,b:1}]];
				
	var img3 = [[{r:1,g:1,b:1},{r:1,g:1,b:1},{r:1,g:1,b:1}],
	            [{r:1,g:1,b:1},{r:1,g:1,b:1},{r:1,g:1,b:1}],
				[{r:1,g:1,b:1},{r:1,g:1,b:1},{r:1,g:1,b:1}]];
				
	var img4 = [[{r:4/9,g:4/9,b:4/9},{r:4/9,g:4/9,b:4/9}],
	            [{r:4/9,g:4/9,b:4/9},{r:4/9,g:4/9,b:4/9}]];
				
	var img5 = [[{r:4/9,g:4/9,b:4/9},{r:6/9,g:6/9,b:6/9},{r:4/9,g:4/9,b:4/9}],
	            [{r:6/9,g:6/9,b:6/9},{r:1,g:1,b:1},{r:6/9,g:6/9,b:6/9}],
				[{r:4/9,g:4/9,b:4/9},{r:6/9,g:6/9,b:6/9},{r:4/9,g:4/9,b:4/9}]];
				
	var img6 = [[{r:1/4,g:1/4,b:1/4},{r:1/2,g:1/2,b:1/2},{r:1/2,g:1/2,b:1/2}],
	            [{r:1/2,g:1/2,b:1/2},{r:1,g:1,b:1},{r:1,g:1,b:1}],
				[{r:1/2,g:1/2,b:1/2},{r:1,g:1,b:1},{r:1,g:1,b:1}]];
				
	var img7 = [[{r:4/100,g:4/100,b:4/100},{r:4/100,g:4/100,b:4/100}],
	            [{r:4/100,g:4/100,b:4/100},{r:4/100,g:4/100,b:4/100}]];
	
	var img8 = [[{r:255,g:255,b:255},{r:255,g:255,b:255}],
	            [{r:255,g:255,b:255},{r:255,g:255,b:255}]];
				
	var img9 = [[{r:0,g:0,b:0},{r:0,g:0,b:0}],
	            [{r:0,g:0,b:0},{r:0,g:0,b:0}]];
				
	var img10 = [[{r:4,g:1,b:3},{r:3,g:7,b:9}]];
	
	var img11 = [[{r: 1.7822, g: 1.7822, b: 1.7822}, {r: 6.294, g: 6.294, b: 6.294}]];
	
	var img12 = [[{r: 16256.25, g: 65025, b: 21675},{r: 21675, g: 9289.285714285716, b: 7225}]];
	
	var img13 = [[{r:3,g:3,b:3},{r:3,g:3,b:3}],
	             [{r:3,g:3,b:3},{r:3,g:3,b:3}]];
				 
	var img14 = [[{r:3,g:3,b:3},{r:4,g:4,b:4},{r:3,g:3,b:3}],
	             [{r:4,g:4,b:4},{r:0,g:0,b:0},{r:4,g:4,b:4}],
				 [{r:3,g:3,b:3},{r:4,g:4,b:4},{r:3,g:3,b:3}]];
	
	var img15 = [[{r:125,g:125,b:125},{r:125,g:125,b:125}],
	             [{r:125,g:125,b:125},{r:125,g:125,b:125}]];
				 
	var img16 = [[{r:255,g:255,b:255},{r:255,g:255,b:255}],
	             [{r:255,g:255,b:255},{r:255,g:255,b:255}]];
				 
	var img17 = [[{r:1,g:1,b:1},{r:0,g:0,b:0}],
	             [{r:0,g:0,b:0},{r:0,g:0,b:0}]];
				 
	var img18 = [[{r:0,g:0,b:0},{r:2,g:2,b:2}],
	             [{r:2,g:2,b:2},{r:1,g:1,b:1}]]; 
	
	//Tests de la fonction comparerDeuxImages
	console.assert (comparerDeuxImages (img1,img1) == true);//Tailles et valeurs identiques
	console.assert (comparerDeuxImages (img1,img2) == false);//Tailles identiques, valeurs différentes
	console.assert (comparerDeuxImages (img1,img3) == false);//Tailles différentes, image1 < image2
	console.assert (comparerDeuxImages (img3,img1) == false);//Tailles différentes, image1 > image2
	
	//Tests de la fonction noirEtBlanc
	console.assert (comparerDeuxImages (noirEtBlanc(img1), noirEtBlanc(img7)) == false);//Images differents ->deux ≠ luminance.
	console.assert (comparerDeuxImages (noirEtBlanc(img9), img9) == true);//Image taille 2x2 de r,g,b=0(noir) renvoie lui meme.
	console.assert (comparerDeuxImages (noirEtBlanc(img3), img3) == true);//Image taille 3x3 de r,g,b= 1 => r,g,b= 1 (luminance).
	console.assert (comparerDeuxImages (noirEtBlanc(img10), img11) == true);// img10 pixel r≠g≠b => img 11 pix 1 et pix 2 (r=g=b).
	
	//Tests de la fonction correctionClarte
	console.assert (comparerDeuxImages (correctionClarte(img8, 0), img8) == true);//Quantité = 0 =>((0/255)^0)*255= 255
	console.assert (comparerDeuxImages (correctionClarte(img9, 2), img9) == true);//Quantité > 1 =>((0/255)^2)*255= 0
	console.assert (comparerDeuxImages (correctionClarte(img10, -1), img12) == true);//Quantité < 1 avec r,g,b diffrents pour pixels.
	
	//Tests de la fonction flou
	console.assert (comparerDeuxImages (flou(img1, 0),img1) == true);// "flou" de taille 0
	console.assert (comparerDeuxImages (flou(img1, 1),img1) == true);// "flou" de taille 1
	console.assert (comparerDeuxImages (flou(img1, 2),img2) == true);// Taille d'image paire, "flou" de taille paire
	console.assert (comparerDeuxImages (flou(img1, 3),img4) == true);// Taille d'image paire, "flou" de taille impaire
	console.assert (comparerDeuxImages (flou(img3, 3),img5) == true);// Taille d'image impaire, "flou" de taille impaire
	console.assert (comparerDeuxImages (flou(img3, 2),img6) == true);// Taille d'image > taille de "flou"
	console.assert (comparerDeuxImages (flou(img1, 10),img7) == true);// Taille d'image < taille de "flou" 
	
	//Tests de la fonction detectionContours
	console.assert (comparerDeuxImages (detectionContours(img9),img9) == true);//Les pixels blanc retournent eux-même
	console.assert (comparerDeuxImages (detectionContours(img1),img13) == true);//Taille d'image < voisinage (N = 3)
	console.assert (comparerDeuxImages (detectionContours(img3),img14) == true);//Taille d'image >= voisinage (N = 3)
	console.assert (comparerDeuxImages (detectionContours(img15),img16) == true);//valeurs de canaux > 255 => retourne 255
	console.assert (comparerDeuxImages (detectionContours(img16),img16) == true);//valeurs max de canaux = 255
	console.assert (comparerDeuxImages (detectionContours(img17),img18) == true);//vérification des valeurs absolues lors résultats négatifs
}

tests();



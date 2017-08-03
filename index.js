var request = require('request');
var cheerio = require('cheerio');

// ne kadar süre ile kontrol edileceği (saniye)
if(process.argv[3]){
    var checkInterval = process.argv[3];
}
else{
    var checkInterval = 60;
}

// Hangi urlden kontrol edileceği
// (Değiştirmek lüzumsuz)
var urlToCheck = "https://sonuc.osym.gov.tr/SonucSec.aspx";

// Varlığı kontrol edilecek yazı regex olarak tanımlanıyor
if(process.argv[2]){
    var regexpToCheck = new RegExp(process.argv[2], 'mgui');
}
else{
    var regexpToCheck = new RegExp('ÖSYS', 'mgui');
}

// tekrar edecek fonksiyon setInterval fonksiyonuna ilk parametre olarak girilir
setInterval(function(){
    // request kütüphanesi ile urlye istek atılıyor
    request(urlToCheck,{encoding: 'utf8', gzip: true}, function(err, res, html){
        // hata varsa yazdır
        if(err) console.error(err);
        else{
            // dönen html dosyası cheerio kütüphanesi ile
            // kolayca manipüle edilebilir hale getiriliyor
            var $ = cheerio.load(html);

            // içeriği kontrol edilecek tablo hücresi tanımlanıyor
            cellToCheck = $('table#grdSonuclar>tbody').children('tr').eq(1)
                .children('td').eq(0);

            // hücre içeriği kontrol ediliyor
            if(regexpToCheck.test(cellToCheck.text())){
                //Açıklandığında yapılacaklar
                console.log("AÇIKLANDI")
                process.exit(0);
            }
            else{
                //Açıklanmadığında yapılacaklar
                console.log("Henüz açıklanmadı");
            }
        }
        
    });
}, checkInterval * 1000);
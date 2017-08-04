var request = require('request');
var cheerio = require('cheerio');

var checkInterval = 60;

// Hangi urlden kontrol edileceği
// (Değiştirmek lüzumsuz)
var urlToCheck = "https://sonuc.osym.gov.tr/SonucSec.aspx";


var mainLoop = function(exam, interval){
    console.log(interval + ' saniyede bir kontrol edilecek.');

    // Varlığı kontrol edilecek yazı regex olarak tanımlanıyor
    var regexpToCheck = new RegExp(exam, 'mgui');
    
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
                var cellToCheck = $('table#grdSonuclar>tbody').children('tr').eq(1)
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
    }, interval * 1000);
}



//kullanıcı girişinin nereden sağlandığı burada kontrol ediliyor.
if(process.argv[2]){
    if(!process.argv[3]) mainLoop(process.argv[2], checkInterval);
    else{
        mainLoop(process.argv[2], process.argv[3]);
    }
}

else{
    var p = require('prompt');
    var promptSchema = {
        properties: {
          regExStr: {
            description: 'Sınav adını giriniz.',
            type: 'string',
            required: true
          },
          checkInterval: {
            description: 'Kontrol aralığını girin (saniye, gerekli değildir)',
            type: 'number',
            default: 60,
            required: false
          }
        }
    };
    p.start();
    p.get(promptSchema, function(err, result){
        if(!err){
            mainLoop(result.regExStr, result.checkInterval);
        }
    });
}


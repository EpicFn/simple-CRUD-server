var template = {
    /**
     * 게시판 템플릿 html을 반환한다
     * @param {number} page 페이지 번호
     * @returns page 별 게시판 html 템플릿
     */
    board : function(page){
        var post = ['', '', '', ''];
        var max_page = 0;

        const fs = require('fs');
        const folderPath = './Data';

        try{
            const files = fs.readdirSync(folderPath);
            files.sort();

            for(var i =0; i<4; i++){
                if(((page-1)*4 + i) < files.length){
                    post[i] = `<li class="content1"><a href='/post/${files[(page-1)*4 + i]}'>${files[(page-1)*4 + i]}</a></li>`;
                }
                else
                    break;
            }

            max_page = (files.length%4 == 0) ? (Math.floor(files.length/4)) : (Math.floor(files.length/4) + 1) ;
            

        } catch (err) {
            console.log('Error reading directory: ', err);
        }

        var back_link = '#';
        var post_link = '#';
        var link_button = ['', '', ''];

        if(page > 3)
            back_link = `/${page-3}`;
        else
            back_link = `/1`;


        if(page+3 > max_page)
            post_link = `/${max_page}`;
        else
            post_link = `/${page+3}`;

        for(var i=0; i<3; i++){
            if(page+i <= max_page){
                link_button[i] = `
            <li class="page-item"><a class="page-link" href="/${page+i}">${page+i}</a></li>
            `
            }
        }


        return `
        <!doctype html>
        <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>커여운 게시판</title>
                <link rel="stylesheet" href="boardStyle.css" >
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic+Coding:wght@700&display=swap" rel="stylesheet">  
            </head>
            <body>
                <header class="main_header">
                    <h1 class="main_title">커여운 게시판!!!</h1>
                </header>

                <main>
                    <ul class="main_board">
                        ${post[0]}
                        ${post[1]}
                        ${post[2]}
                        ${post[3]}
                    </ul>
                    <nav class="arrowBar" aria-label="Page navigation example">
                        <ul class="pagination">
                            <li class="page-item">
                                <a class="page-link" href=${back_link} aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            ${link_button[0]}
                            ${link_button[1]}
                            ${link_button[2]}
                            <li class="page-item">
                                <a class="page-link" href=${post_link} aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </main>

                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            </body>
        </html>
        `;
    },
    post : function(){
        return `
        post
        `
    }
};

module.exports = template;


var template = {
    /**
     * 게시판 템플릿 html을 반환한다
     * @param {number} page 페이지 번호
     * @param {Connection} DB mysql 서버의 connection   * 
     * @returns page 별 게시판 html 템플릿
     */
    board : async function(page, DB_meta_Data){
        var post = ['', '', '', ''];
        var max_page = 0;

        var mysql = require('mysql2/promise');

        try {
        // MySQL 연결 설정
            const DB = await mysql.createConnection({
                host     : DB_meta_Data.host,
                user     : DB_meta_Data.user,
                password : DB_meta_Data.password,
                database : DB_meta_Data.database
            });

            // 쿼리 실행
            var query = `SELECT * FROM posts ORDER BY created_time LIMIT ${(page-1)*4}, ${4}`;
            var [posts] = await DB.execute(query);
            

            for(var i =0; i<posts.length; i++){
                post[i] = 
                `<li class="content"><a href='/post?id=${posts[i].id}'>${posts[i].title}</a></li>`;
            }

            const [count] = await DB.execute(`SELECT COUNT(*) AS count FROM posts`);
            max_page = Math.ceil(count[0].count / 4);


            // MySQL 연결 종료
            await DB.end();
        } catch (error) {
                console.error('Error:', error);
                return '';
        }
        
        // 이동버튼 설정
        var back_link = '#';
        var post_link = '#';
        var link_button = ['', '', ''];

        if(page > 3)
            back_link = `/board?page=${page-3}`;
        else
            back_link = `/board?page=1`;


        if(page+3 > max_page)
            post_link = `/board?page=${max_page}`;
        else
            post_link = `/board?page=${page+3}`;

        for(var i=0; i<3; i++){
            if(page+i <= max_page){
                link_button[i] = `
            <li class="page-item"><a class="page-link" href="/board?page=${page+i}">${page+i}</a></li>
            `
            }
        }


        //return 
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
                    <h1 class="main_title"><a href="/">커여운 게시판!!!</a></h1>
                    <a href='/create' class='create_button'>글 작성</a>
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
    post : async function(id, DB_meta_Data){

        var title = 'hello';
        var description = 'null';

        var mysql = require('mysql2/promise');
        try {
            // MySQL 연결 설정
                const DB = await mysql.createConnection({
                    host     : DB_meta_Data.host,
                    user     : DB_meta_Data.user,
                    password : DB_meta_Data.password,
                    database : DB_meta_Data.database
                });
    
                // 쿼리 실행
                var query = `SELECT title, description FROM posts WHERE id = ?`;
                var [posts] = await DB.execute(query, [id]);
                
                title = posts[0].title;
                description = posts[0].description;
    
                // MySQL 연결 종료
                await DB.end();
            } catch (error) {
                    console.error('Error:', error);
                    return '';
            }

        

        return `
        <!doctype html>
        <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>${title}</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                <link rel="stylesheet" href="postStyle.css" >
            </head>
            <body>
                <header>
                    <nav class="navbar bg-primary" data-bs-theme="dark">
                        <div class="container-fluid">
                            <a class="navbar-brand" href="/">게시판!!</a>
                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarNav">
                                <ul class="navbar-nav">
                                    <li class="nav-item">
                                        <a class="nav-link active" aria-current="page" href="/update?id=${id}">수정</a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link" href="/delete?id=${id}">삭제</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </header>
                <main>
                    <h1>${title}</h1>
                    <article>${description}</article>
                </main>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            </body>
        </html>
        `
    },

    inputForm : function(mode, id=null) {

        var title = '';
        var line = '';
        if(id!=null){
            title = id;
            var fs = require('fs')
            const filepath = `./Data/${id}`;

            try {
                line = fs.readFileSync(filepath, 'utf8');
            }   catch(err){
                console.error(err);
            }
        }


        return `
        <!doctype html>
        <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Bootstrap demo</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            </head>
            <body>
                <header class="main_header">
                    <h1 class="main_title"><a href="/">커여운 게시판!!!</a></h1>
                </header>
                <main>
                    <form action = "/${mode}_process" accept-charset="utf-8" name="createData" method="post">
                        <div class="mb-3">
                            <label for="exampleFormControlInput1" class="form-label">제목</label>
                            <input type="text" class="form-control" id="exampleFormControlInput1" name="title" value="${title}">
                        </div>
                        <div class="mb-3">
                            <label for="exampleFormControlTextarea1" class="form-label">내용</label>
                            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" name="line">${line}</textarea>
                        </div>
                        <input type="submit">
                    </form>
                </main>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            </body>
        </html>
        <style>
            main {
                margin : 20px
            }

            .main_header {
                background-color : rgb(40, 40, 147);
                display : flex;
                justify-content: center;
            }    
            
            .main_header .main_title {
                color : white;
                padding : 20px;
                font-family: "Nanum Gothic Coding", monospace;
                font-weight: 700;
                font-style: normal;
            }

            .main_title > a {
                text-decoration: none;
                color : white;
            }
        </style>
`
    }
};

module.exports = template;
var mysql = require('mysql2/promise');

async function fetchData() {
    try {
        // MySQL 연결 설정
        const connection = await mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : '583327',
            database : 'simple_crud'
        });

        // 쿼리 실행
        const [rows, fields] = await connection.execute('SELECT * FROM posts');

        // 결과 처리
        console.log(rows); // 쿼리 결과 출력

        // MySQL 연결 종료
        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

// fetchData 함수 호출
fetchData();

module.exports = {
    loadPageTwo: (req, res) => {
        res.render('two_table.ejs', { // Pass data to front end
            title: "Two Table Query",
            result1: false,
            result2: false
        });
    },
    twoQuery1: (req, res) => {
        //query here
        let year1 = req.body.query1_1;
        let year2 = req.body.query1_2;
        let query = `SELECT r.author, COUNT(r.author) reviewCount
                        FROM reviews r, years y
                        WHERE r.reviewid = y.reviewid AND
                            y.year BETWEEN ` + year1 + ` AND ` + year2 + `
                        GROUP BY r.author
                        ORDER BY COUNT(r.author) DESC
                        LIMIT 3`;
        console.log(query);
        
        db.query(query, (err, output) => {
            if (err) res.redirect('/'); 

            res.render('two_table.ejs', { // Pass data to front end
                title: "Two Table Query 1", 
                result1: output,
                result2: false
            });
        });
    },
    twoQuery2: (req, res) => {
        //query here
        let year = req.body.query2;
        let query = `SELECT g.genre, COUNT(g.reviewid) reviewCount
                        FROM genres g, reviews r
                        WHERE g.reviewid = r.reviewid AND r.pub_year = ` + year + `
                        GROUP BY g.genre
                        HAVING COUNT(g.reviewid) = (
                            SELECT MIN(genrecount)
                                FROM (
                        SELECT COUNT(g.reviewid) genrecount
                                    FROM genres g, reviews r
                                    WHERE g.reviewid = r.reviewid AND r.pub_year = ` + year + `
                                    GROUP BY g.genre
                                    ) a )`;
        console.log(query);
        
        db.query(query, (err, output) => {
            if (err) res.redirect('/'); 

            res.render('two_table.ejs', { // Pass data to front end
                title: "Two Table Query 2", 
                result1: false,
                result2: output
            });
        });
    },
}
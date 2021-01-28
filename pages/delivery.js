import React, { useRef, useState } from 'react';
import { connectToDatabase } from "../util/mongodb";

export default function Delivery({ posts }) {
  //const [count, setCount] = useState(1);
  const wrapperRef = useRef(null);


  const copyToClipboard = (index, areaNumber) => {
    // `current` points to where the mounted dom element where the ref is set.
    const onePost = wrapperRef.current.querySelector(`.index_${index}`)
    const oneLang = onePost.querySelectorAll('textarea')[areaNumber];
    oneLang.select();
    document.execCommand('copy');
    
    oneLang.value = 'COPIED';
    oneLang.style.fontSize = "30px";
    oneLang.style.textAlign = "center";
  };

  var allPosts = posts.map((post, index) => {

    var formattedDate = post.date.replace(/T/, ' \xa0\xa0\xa0').split(".")[0]
    var englishHtml = post.en1 + post.en2 + post.en3 + post.en4 + post.en5;
    var frenchHtml = post.fr1 + post.fr2 + post.fr3 + post.fr4 + post.fr5;
    var germanHtml = post.de1 + post.de2 + post.de3 + post.de4 + post.de5;

    return (
      <div className={post.title} key={post._id}>
        <h2>{formattedDate}</h2>

        <div className={"wrapper index_" + index}>
          <div className="one en">
            <h3>Eng</h3>
            <button onClick={() => {copyToClipboard(index, 0)}}>COPY</button>
            <textarea value={englishHtml.toString()} readOnly></textarea>
          </div>

          <div className="one fr">
            <h3>Fr</h3>
            <button onClick={() => {copyToClipboard(index, 1)}}>COPY</button> 
            <textarea value={frenchHtml.toString()} readOnly></textarea>
          </div>

          <div className="one de">
            <h3>De</h3>
            <button onClick={() => {copyToClipboard(index, 2)}}>COPY</button>
            <textarea value={germanHtml.toString()} readOnly></textarea>
          </div>
        </div>

      </div>
    )
  })

  return (
    <div ref={wrapperRef}>
      <h1>Latest delivery pages </h1>
      <ul>
        {allPosts}
      </ul>

      <style jsx global>{`

        body{
          margin: 0;
          padding: 0;
        }
        h1{
          padding-left: 40px;
          color: grey;
          font-family: system-ui;
          font-variant: all-small-caps;
        }
        .one,.one textarea {
          font-size: 5px;
          height: 200px;
          width: 300px;
          max-width:  350px;
          list-style-type:none;
          padding-inline-start: 0px;
          margin-right: 50px;
          margin-bottom: 150px;
          
        }

        h2{
          font-family: system-ui;
          font-variant: all-small-caps;
        }
        .one h3 {
          font-size: 25px;
          margin-top: 0;
          margin-bottom: 10px;
          font-family: system-ui;
        }

        .one button{
          width: 300px;
          height: 40px;
          margin-bottom: 10px;
        }

        @media screen and (min-width: 768px){
          .wrapper{
            display: flex;
            flex-direction: row;
          }
        }

      `}</style>
    </div>
  );
}
export async function getServerSideProps() {
  const { db } = await connectToDatabase();
  const posts = await db
    .collection("posts")
    .find({})
    .sort({ date: -1 })
    .limit(3)
    .toArray();
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
}
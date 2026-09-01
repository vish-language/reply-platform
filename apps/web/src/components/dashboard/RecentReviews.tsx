interface Props {
  reviews: any[];
}


export default function RecentReviews({ reviews }: Props) {


  return (

    <div
      className="
      bg-white
      border
      rounded-xl
      p-5
      mt-8
      "
    >

      <h2
        className="
        text-xl
        font-bold
        "
      >
        Recent Reviews
      </h2>



      {
        reviews.length === 0 ? (

          <p
            className="
            text-gray-400
            mt-4
            "
          >
            No reviews yet
          </p>


        ) : (


          <div className="mt-5 space-y-4">


            {
              reviews.map((review)=>(

                <div
                  key={review.id}
                  className="
                  border
                  rounded-lg
                  p-4
                  "
                >

                  <h3
                    className="
                    font-semibold
                    "
                  >
                    {review.authorName}
                  </h3>


                  <p
                    className="
                    text-gray-600
                    mt-2
                    "
                  >
                    {review.content}
                  </p>



                </div>


              ))
            }


          </div>


        )
      }


    </div>

  );

}
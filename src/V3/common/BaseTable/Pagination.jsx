import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { range } from "lodash";

import PageButton from "./PageButton";

const Pagination = ({ paginate, style = {} }) => {
  const { previous, gotoPage, totalPages, page, next } = paginate;
  const startingNavigation = useMemo(
    () => [
      {
        description: "<",
        onClick: previous,
        isActive: page === 1,
        isFirstOrLast: false,
        isArrowButton: true,
      },
      {
        description: 1,
        onClick: () => gotoPage(1),
        isActive: page === 1,
        isFirstOrLast: false,
      },
    ],
    [page, previous, gotoPage]
  );

  const endingNavigation = useMemo(
    () => [
      {
        description: totalPages,
        onClick: () => gotoPage(totalPages),
        isActive: page === totalPages,
        isFirstOrLast: false,
      },
      {
        description: ">",
        onClick: next,
        isActive: page === totalPages,
        isFirstOrLast: false,
        isArrowButton: true,
      },
    ],
    [totalPages, page, next, gotoPage]
  );

  const pages = useMemo(() => {
    if (totalPages < 6) {
      return range(2, totalPages).map((num) => ({
        description: num,
        onClick: () => gotoPage(num),
        isActive: page === num,
        isFirstOrLast: false,
      }));
    }

    if (page <= 3) {
      return [
        ...range(2, 6).map((num) => ({
          description: num === 5 ? "..." : num,
          onClick: () => gotoPage(num === 5 ? 6 : num),
          isActive: page === num,
          isFirstOrLast: num === 5,
        })),
      ];
    }

    if (page > totalPages - 3) {
      return [
        ...range(1, 5).map((num) => ({
          description: num === 1 ? "..." : totalPages - (5 - num),
          onClick: () =>
            gotoPage(num === 1 ? totalPages - 5 : totalPages - (5 - num)),
          isActive: page === totalPages - (5 - num),
          isFirstOrLast: num === 1,
        })),
      ];
    }

    return [
      {
        description: "...",
        onClick: () => gotoPage(page - 3),
        isActive: false,
        isFirstOrLast: true,
      },
      ...range(1, 4).map((i) => {
        const item = i % 2 === 0 ? page : i === 1 ? page - 1 : page + 1;

        return {
          description: item,
          onClick: () => gotoPage(item),
          isActive: item === page,
          isFirstOrLast: false,
        };
      }),
      {
        description: "...",
        onClick: () => gotoPage(page + 3),
        isActive: false,
        isFirstOrLast: true,
      },
    ];
  }, [page, totalPages, gotoPage]);

  const mobilePages = useMemo(
    () => [
      {
        description: "<<",
        onClick: () => gotoPage(1),
        isActive: page === 1,
        isFirstOrLast: false,
        isArrowButton: true,
      },
      {
        description: "<",
        onClick: previous,
        isActive: page === 1,
        isFirstOrLast: false,
        isArrowButton: true,
      },
      {
        description: page,
        isFirstOrLast: true,
      },
      {
        description: ">",
        onClick: next,
        isActive: page === totalPages,
        isFirstOrLast: false,
        isArrowButton: true,
      },
      {
        description: ">>",
        onClick: () => gotoPage(totalPages),
        isActive: page === totalPages,
        isFirstOrLast: false,
        isArrowButton: true,
      },
    ],
    [page, totalPages, gotoPage, next, previous]
  );

  return (
    <>
      <div
        className={`d-none d-sm-flex ${
          totalPages > 1 ? "p-2" : ""
        } justify-content-end flex-wrap gap-2 align-content-center`}
        style={style}
      >
        {totalPages > 1 && (
          <>
            {[...startingNavigation, ...pages, ...endingNavigation].map(
              ({ description, ...rest }, index) => (
                <PageButton key={index} {...rest}>
                  {description}
                </PageButton>
              )
            )}
          </>
        )}
      </div>

      <div className="justify-content-end p-2 flex-wrap gap-2 align-content-center mobile-pagination">
        {totalPages > 1 &&
          mobilePages.map(({ description, ...rest }, index) => (
            <PageButton key={index} {...rest}>
              {description}
            </PageButton>
          ))}
      </div>
    </>
  );
};

Pagination.propTypes = {
  style: PropTypes.object,
  paginate: PropTypes.shape({
    previous: PropTypes.func,
    gotoPage: PropTypes.func,
    totalPages: PropTypes.number,
    page: PropTypes.number,
    next: PropTypes.func,
  }),
};

export default Pagination;

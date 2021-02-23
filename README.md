# Semantic Annotation Verification on IMDB movies

## Tasklist

[x] Scrap ld/JSON from the websites
[x] Scrap microdata from the websites
[x] Scrap schema from schema.org
[x] Validate metadata against the schema.org knowledge base
[x] Create UI to run test on all user given sites

## Issues

- Can it handle nesting of microdata?
- Cannot handle microdata object in root element
- Cannot render js apps... Use puppeteer?
- Very specific for IMDB

## Conclusion

- Semantic web has a long way to go, there may a standardization with respect to the methodology to put metadata into a site but, the format in which it should be provided still has a long way to go.
- Since all sites follow different formats it becomes very difficult to create a generalized scraper to retrieve the said metadata.

function makeSPARQLQuery( endpointUrl, sparqlQuery, doneCallback ) {
	var settings = {
		headers: { Accept: 'application/sparql-results+json' },
		data: { query: sparqlQuery }
	};
	return $.ajax( endpointUrl, settings ).then( doneCallback );
}

var endpointUrl = 'https://query.wikidata.org/sparql',
	sparqlQuery = "SELECT DISTINCT ?item ?itemLabel ?state ?stateLabel ?start_time ?cases ?cases_time ?recs ?recs_time ?deaths ?deaths_time ?tests ?tests_time\n" +
        "WITH {\n" +
        "  SELECT ?item ?dist ?state ?cases ?cases_time {\n" +
        "    wd:Q84055514 wdt:P527 ?item. ?item wdt:P276 ?state.\n" +
        "    OPTIONAL { ?item p:P1603 ?casestmt. ?casestmt ps:P1603 ?cases. OPTIONAL { ?casestmt pq:P585 ?cases_time } }\n" +
        "    FILTER NOT EXISTS { ?item p:P1603/pq:P585 ?cases_time_ . FILTER(?cases_time_ > ?cases_time) }\n" +
        "  }\n" +
        "}\n" +
        "AS %cases\n" +
        "WITH {\n" +
        "  SELECT ?item ?deaths ?deaths_time {\n" +
        "    wd:Q84055514 wdt:P527 ?item.\n" +
        "    OPTIONAL { ?item p:P1120 ?deathstmt. ?deathstmt ps:P1120 ?deaths. OPTIONAL { ?deathstmt pq:P585 ?deaths_time } }\n" +
        "    FILTER NOT EXISTS { ?item p:P1120/pq:P585 ?deaths_time_ . FILTER(?deaths_time_ > ?deaths_time) }\n" +
        "  }\n" +
        "}\n" +
        "AS %deaths\n" +
        "WITH {\n" +
        "  SELECT ?item ?recs ?recs_time {\n" +
        "    wd:Q84055514 wdt:P527 ?item.\n" +
        "    OPTIONAL { ?item p:P8010 ?recstmt. ?recstmt ps:P8010 ?recs. OPTIONAL { ?recstmt pq:P585 ?recs_time } }\n" +
        "    FILTER NOT EXISTS { ?item p:P8010/pq:P585 ?recs_time_ . FILTER(?recs_time_ > ?recs_time) }\n" +
        "  }\n" +
        "}\n" +
        "AS %recs\n" +
        "WITH {\n" +
        "  SELECT ?item ?tests ?tests_time {\n" +
        "    wd:Q84055514 wdt:P527 ?item.\n" +
        "    OPTIONAL { ?item p:P8011 ?testmt. ?testmt ps:P8011 ?tests. OPTIONAL { ?testmt pq:P585 ?tests_time } }\n" +
        "    FILTER NOT EXISTS { ?item p:P8011/pq:P585 ?tests_time_ . FILTER(?tests_time_ > ?tests_time) }\n" +
        "  }\n" +
        "}\n" +
        "AS %tests\n" +
        "WHERE {\n" +
        "  INCLUDE %cases. INCLUDE %deaths. INCLUDE %recs. INCLUDE %tests.\n" +
        "  OPTIONAL { ?item wdt:P580 ?start_time. }\n" +
        "  SERVICE wikibase:label { bd:serviceParam wikibase:language \"[AUTO_LANGUAGE],en\". }\n" +
        "}\n" +
        "ORDER BY DESC (?cases)";

makeSPARQLQuery( endpointUrl, sparqlQuery, function( data ) {
		$( 'body' ).append( $( '<pre>' ).text( JSON.stringify( data ) ) );
		console.log( data );
	}
);
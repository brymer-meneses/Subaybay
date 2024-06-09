# Procedures on requests

## (Move) Forward

Change a request's current stage to the next stage, that is, closer to completion

## (Move) Backward

Change a request's current stage to a previous stage, that is, further from completion

## Pass

Change a request's handler, encompasses all movement (forward, backward, or without changing the stage).

## Pass to Next

Finish a stage and move a request forward, to the next handler

When referring to _stages_, the term "finish" has the same meaning as "pass to next" <br/>

## Reassign

Change the handler of a request's current stage.

A request can only at one stage at a time, so phrases like "reassign a **request**" and "reassign a **stage**"
can be used interchangeably

## Rollback

Move a request backwards to a previous stage.

## Finish (request)

Complete a request. The request should be archived right after

When referring to requests, the phrase "fully finish" may be used, but it has the same meaning as "finish"

# DR-758: Training Report Award Authority

Teacher recovery summaries now count Star Dust only from the authoritative
`training_completed` event. `training_answer_result` remains response evidence
and is not counted as a second award. This keeps teacher reporting aligned with
the normalized recovery progression result. See ADR 0686.
